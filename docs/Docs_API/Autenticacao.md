# Documentação de Autenticação da API SoftOne

Esta documentação descreve o processo de autenticação na API SoftOne, detalhando os endpoints disponíveis, métodos e respostas.

## Visão Geral

A autenticação na API SoftOne é baseada em tokens JWT (JSON Web Token). Para acessar os endpoints protegidos da API, você deve primeiro obter um token de autenticação através do endpoint de login.

## Endpoint de Autenticação

### Login

**Endpoint:** `POST /api/Auth/login`

**Descrição:** Autentica um usuário e retorna um token JWT para ser usado nas requisições subsequentes.

**Payload:** 

```json
{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

**Exemplo de Resposta bem-sucedida (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**Exemplo de Resposta mal-sucedida (401 Unauthorized):**

```json
{
  "error": "Senha inválida"
}
```

ou

```json
{
  "error": "Usuário não encontrado"
}
```

**Exemplo de Resposta mal-sucedida (400 Bad Request):**

```json
{
  "errors": [
    "O nome de usuário não pode ser nulo ou vazio.",
    "A senha não pode ser nula ou vazia."
  ]
}
```

## Como Usar o Token

Após obter o token JWT, você deve incluí-lo no cabeçalho `Authorization` de todas as suas requisições subsequentes:

```
Authorization: Bearer [seu_token]
```

## Estrutura do Token JWT

O token JWT contém as seguintes informações (claims):

1. **Name:** O nome de usuário
2. **NameIdentifier:** O ID do usuário
3. **Role:** A função do usuário (Admin, Manager, User ou um valor personalizado do campo "Funcao")

A expiração padrão do token é de 1 hora.

## Erro de Autenticação

Se o token estiver ausente, inválido ou expirado, a API retornará uma resposta `401 Unauthorized`.

## Dicas de Segurança

1. **Nunca compartilhe seu token** com outros usuários ou sistemas não autorizados.
2. **Armazene o token com segurança** no lado do cliente, como em HttpOnly cookies para aplicações web.
3. **Renove o token antes da expiração** para manter a sessão ativa sem interrupções.
4. **Use HTTPS** para todas as comunicações com a API para evitar que o token seja interceptado.

## Exemplo de Autenticação com cURL

```bash
curl -X POST "https://seu-servidor/api/Auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"senha123"}'
```

## Exemplo de Autenticação com JavaScript (Fetch API)

```javascript
fetch('https://seu-servidor/api/Auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'senha123'
  })
})
.then(response => response.json())
.then(data => {
  // Armazenar o token para uso futuro
  localStorage.setItem('token', data.token);
  console.log('Token:', data.token);
})
.catch(error => console.error('Erro na autenticação:', error));
```

## Exemplo de Requisição Autenticada com JavaScript

```javascript
fetch('https://seu-servidor/api/VisitasProfissionais', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Exemplo de Autenticação com C# (HttpClient)

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class AuthService
{
    private readonly HttpClient _client;
    
    public AuthService(string baseUrl)
    {
        _client = new HttpClient();
        _client.BaseAddress = new Uri(baseUrl);
        _client.DefaultRequestHeaders.Accept.Clear();
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }
    
    public async Task<string> Login(string username, string password)
    {
        var loginData = new 
        { 
            username = username, 
            password = password 
        };
        
        var content = new StringContent(
            JsonSerializer.Serialize(loginData),
            Encoding.UTF8,
            "application/json");
        
        HttpResponseMessage response = await _client.PostAsync("api/Auth/login", content);
        
        if (response.IsSuccessStatusCode)
        {
            string responseBody = await response.Content.ReadAsStringAsync();
            using (JsonDocument document = JsonDocument.Parse(responseBody))
            {
                return document.RootElement.GetProperty("token").GetString();
            }
        }
        
        throw new Exception($"Erro de autenticação: {response.StatusCode}");
    }
}
```

## Renovação de Token

**Endpoint:** `POST /api/Auth/refresh-token`

**Descrição:** Renova um token JWT existente, gerando um novo token com tempo de expiração atualizado.

**Headers:**
```
Authorization: Bearer seu_token_atual
```

**Exemplo de Resposta bem-sucedida (200 OK):**
```json
{
  "token": "novo_token_jwt"
}
```

**Exemplo de Resposta mal-sucedida (401 Unauthorized):**
```json
{
  "error": "Token inválido"
}
```

ou

```json
{
  "error": "Usuário não encontrado ou inativo"
}
```

## Como Usar o Refresh Token

1. Quando o token atual estiver próximo de expirar, faça uma requisição para o endpoint de refresh
2. Use o novo token retornado para as próximas requisições
3. Continue usando o novo token até que ele também esteja próximo de expirar

## Dicas de Segurança Adicionais

1. **Implemente renovação automática de token** no lado do cliente antes que o token atual expire
2. **Mantenha um buffer de tempo** para renovação (por exemplo, renovar quando faltar 5 minutos para expirar)
3. **Trate erros de renovação** adequadamente, redirecionando para o login quando necessário
4. **Use HTTPS** para todas as comunicações com a API

## Exemplo de Autenticação com cURL

```bash
curl -X POST "https://seu-servidor/api/Auth/refresh-token" \
     -H "Authorization: Bearer seu_token_atual"
```

## Exemplo de Autenticação com JavaScript (Fetch API)

```javascript
fetch('https://seu-servidor/api/Auth/refresh-token', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => response.json())
.then(data => {
  // Armazenar o novo token para uso futuro
  localStorage.setItem('token', data.token);
  console.log('Token renovado:', data.token);
})
.catch(error => console.error('Erro na renovação de token:', error));
```

## Exemplo de Autenticação com C# (HttpClient)

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class AuthService
{
    private readonly HttpClient _client;
    
    public AuthService(string baseUrl)
    {
        _client = new HttpClient();
        _client.BaseAddress = new Uri(baseUrl);
        _client.DefaultRequestHeaders.Accept.Clear();
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }
    
    public async Task<string> RefreshToken(string token)
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        
        HttpResponseMessage response = await _client.PostAsync("api/Auth/refresh-token", null);
        
        if (response.IsSuccessStatusCode)
        {
            string responseBody = await response.Content.ReadAsStringAsync();
            using (JsonDocument document = JsonDocument.Parse(responseBody))
            {
                return document.RootElement.GetProperty("token").GetString();
            }
        }
        
        throw new Exception($"Erro de renovação de token: {response.StatusCode}");
    }
}
``` 