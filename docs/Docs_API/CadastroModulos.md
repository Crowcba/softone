# Documentação da API de Módulos

Esta documentação descreve como utilizar a API de Módulos no sistema SoftOne, que permite gerenciar os módulos disponíveis no sistema.

## Base URL

```
https://[seu-servidor]/api/CadastroModulos
```

## Endpoints Disponíveis

### 1. Listar Todos os Módulos

**Endpoint:** `GET /api/CadastroModulos`

**Descrição:** Retorna uma lista de todos os módulos cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Gestão de Usuários",
    "descricao": "Módulo para gerenciamento de usuários do sistema",
    "status": true
  },
  {
    "id": 2,
    "nome": "Financeiro",
    "descricao": "Módulo de gestão financeira",
    "status": true
  }
]
```

### 2. Obter Módulo por ID

**Endpoint:** `GET /api/CadastroModulos/{id}`

**Descrição:** Retorna os detalhes de um módulo específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "id": 1,
  "nome": "Gestão de Usuários",
  "descricao": "Módulo para gerenciamento de usuários do sistema",
  "status": true
}
```

### 3. Criar Novo Módulo

**Endpoint:** `POST /api/CadastroModulos`

**Descrição:** Cria um novo módulo no sistema.

**Payload:** O corpo da requisição deve conter os dados do módulo conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "nome": "Relatórios",
  "descricao": "Módulo de geração de relatórios",
  "status": true
}
```

**Exemplo de Resposta:**
```json
{
  "id": 3,
  "nome": "Relatórios",
  "descricao": "Módulo de geração de relatórios",
  "status": true
}
```

### 4. Atualizar Módulo

**Endpoint:** `PUT /api/CadastroModulos/{id}`

**Descrição:** Atualiza os dados de um módulo existente.

**Payload:** O corpo da requisição deve conter todos os dados do módulo, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "id": 3,
  "nome": "Relatórios Avançados",
  "descricao": "Módulo de geração de relatórios avançados",
  "status": true
}
```

### 5. Excluir Módulo

**Endpoint:** `DELETE /api/CadastroModulos/{id}`

**Descrição:** Remove um módulo do sistema.

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todos os módulos

```bash
curl -X GET "https://seu-servidor/api/CadastroModulos" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo módulo

```bash
curl -X POST "https://seu-servidor/api/CadastroModulos" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "nome": "Gestão de Estoque",
           "descricao": "Módulo para controle de estoque",
           "status": true
         }'
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todos os módulos
fetch('https://seu-servidor/api/CadastroModulos', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Cadastrar um novo módulo
const novoModulo = {
  nome: "Dashboard",
  descricao: "Módulo de painéis de controle",
  status: true
};

fetch('https://seu-servidor/api/CadastroModulos', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoModulo)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Exemplo de Uso com C# (HttpClient)

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ModuloService
{
    private readonly HttpClient _client;
    
    public ModuloService(string baseUrl, string token)
    {
        _client = new HttpClient();
        _client.BaseAddress = new Uri(baseUrl);
        _client.DefaultRequestHeaders.Accept.Clear();
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
    
    public async Task<List<Modulo>> ListarModulos()
    {
        HttpResponseMessage response = await _client.GetAsync("api/CadastroModulos");
        
        if (response.IsSuccessStatusCode)
        {
            string json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<Modulo>>(json);
        }
        
        throw new Exception($"Erro ao listar módulos: {response.StatusCode}");
    }
    
    public async Task<Modulo> CriarModulo(Modulo modulo)
    {
        string json = JsonConvert.SerializeObject(modulo);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        HttpResponseMessage response = await _client.PostAsync("api/CadastroModulos", content);
        
        if (response.IsSuccessStatusCode)
        {
            string responseJson = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<Modulo>(responseJson);
        }
        
        throw new Exception($"Erro ao criar módulo: {response.StatusCode}");
    }
}

public class Modulo
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Descricao { get; set; }
    public bool Status { get; set; }
}
```

## Observações Importantes

1. O campo `id` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `nome` é obrigatório e deve ser único no sistema.
3. O campo `status` indica se o módulo está ativo ou inativo no sistema.
4. Todas as requisições a esta API requerem autenticação com token JWT.
5. A exclusão de um módulo pode afetar permissões de usuários que tenham acesso a este módulo. 