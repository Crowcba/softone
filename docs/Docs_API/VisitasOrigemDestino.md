# Documentação da API de Origem e Destino de Visitas

Esta documentação descreve como utilizar a API de Origem e Destino de Visitas no sistema SoftOne, que permite gerenciar os pontos de origem e destino para visitas profissionais.

## Base URL

```
https://[seu-servidor]/api/VisitasOrigemDestino
```

## Endpoints Disponíveis

### 1. Listar Todas as Origens/Destinos

**Endpoint:** `GET /api/VisitasOrigemDestino`

**Descrição:** Retorna uma lista de todas as origens e destinos cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "idOrigemDestino": 1,
    "nomeOrigemDestino": "Hospital São Lucas",
    "descricaoOrigemDestino": "Hospital geral na zona sul",
    "status": true
  },
  {
    "idOrigemDestino": 2,
    "nomeOrigemDestino": "Clínica Santa Maria",
    "descricaoOrigemDestino": "Clínica médica especializada",
    "status": true
  }
]
```

### 2. Obter Origem/Destino por ID

**Endpoint:** `GET /api/VisitasOrigemDestino/{id}`

**Descrição:** Retorna os detalhes de uma origem/destino específica pelo ID.

**Exemplo de Resposta:**
```json
{
  "idOrigemDestino": 1,
  "nomeOrigemDestino": "Hospital São Lucas",
  "descricaoOrigemDestino": "Hospital geral na zona sul",
  "status": true
}
```

### 3. Criar Nova Origem/Destino

**Endpoint:** `POST /api/VisitasOrigemDestino`

**Descrição:** Cria um novo registro de origem/destino no sistema.

**Payload:** O corpo da requisição deve conter os dados da origem/destino conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "nomeOrigemDestino": "Centro Médico Paulista",
  "descricaoOrigemDestino": "Centro médico de especialidades",
  "status": true
}
```

**Exemplo de Resposta:**
```json
{
  "idOrigemDestino": 3,
  "nomeOrigemDestino": "Centro Médico Paulista",
  "descricaoOrigemDestino": "Centro médico de especialidades",
  "status": true
}
```

### 4. Atualizar Origem/Destino

**Endpoint:** `PUT /api/VisitasOrigemDestino/{id}`

**Descrição:** Atualiza os dados de uma origem/destino existente.

**Payload:** O corpo da requisição deve conter todos os dados da origem/destino, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "idOrigemDestino": 3,
  "nomeOrigemDestino": "Centro Médico Paulista",
  "descricaoOrigemDestino": "Centro médico de especialidades avançadas",
  "status": true
}
```

### 5. Excluir Origem/Destino

**Endpoint:** `DELETE /api/VisitasOrigemDestino/{id}`

**Descrição:** Remove uma origem/destino do sistema.

### 6. Atualizar Status da Origem/Destino

**Endpoint:** `PATCH /api/VisitasOrigemDestino/UpdateStatus/{id}`

**Descrição:** Atualiza apenas o status de uma origem/destino existente, alternando entre ativo e inativo.

**Observação:** Este endpoint não requer payload, pois ele alterna automaticamente o status atual.

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todas as origens/destinos

```bash
curl -X GET "https://seu-servidor/api/VisitasOrigemDestino" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar uma nova origem/destino

```bash
curl -X POST "https://seu-servidor/api/VisitasOrigemDestino" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "nomeOrigemDestino": "Hospital Regional",
           "descricaoOrigemDestino": "Hospital público regional",
           "status": true
         }'
```

### Atualizar o status de uma origem/destino

```bash
curl -X PATCH "https://seu-servidor/api/VisitasOrigemDestino/UpdateStatus/3" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todas as origens/destinos
fetch('https://seu-servidor/api/VisitasOrigemDestino', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Cadastrar uma nova origem/destino
const novaOrigemDestino = {
  nomeOrigemDestino: "Clínica Ortopédica",
  descricaoOrigemDestino: "Clínica especializada em ortopedia",
  status: true
};

fetch('https://seu-servidor/api/VisitasOrigemDestino', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novaOrigemDestino)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Atualizar o status de uma origem/destino
fetch('https://seu-servidor/api/VisitasOrigemDestino/UpdateStatus/3', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (response.ok) {
    console.log('Status atualizado com sucesso');
  }
})
.catch(error => console.error('Erro:', error));
```

## Exemplo de Uso com C# (HttpClient)

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class OrigemDestinoService
{
    private readonly HttpClient _client;
    
    public OrigemDestinoService(string baseUrl, string token)
    {
        _client = new HttpClient();
        _client.BaseAddress = new Uri(baseUrl);
        _client.DefaultRequestHeaders.Accept.Clear();
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
    
    public async Task<List<OrigemDestino>> ListarOrigensDestinos()
    {
        HttpResponseMessage response = await _client.GetAsync("api/VisitasOrigemDestino");
        
        if (response.IsSuccessStatusCode)
        {
            string json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<List<OrigemDestino>>(json);
        }
        
        throw new Exception($"Erro ao listar origens/destinos: {response.StatusCode}");
    }
    
    public async Task<OrigemDestino> CriarOrigemDestino(OrigemDestino origemDestino)
    {
        string json = JsonConvert.SerializeObject(origemDestino);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        HttpResponseMessage response = await _client.PostAsync("api/VisitasOrigemDestino", content);
        
        if (response.IsSuccessStatusCode)
        {
            string responseJson = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<OrigemDestino>(responseJson);
        }
        
        throw new Exception($"Erro ao criar origem/destino: {response.StatusCode}");
    }
    
    public async Task AlternarStatus(int id)
    {
        HttpResponseMessage response = await _client.PatchAsync($"api/VisitasOrigemDestino/UpdateStatus/{id}", null);
        
        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Erro ao alternar status: {response.StatusCode}");
        }
    }
}

public class OrigemDestino
{
    public int IdOrigemDestino { get; set; }
    public string NomeOrigemDestino { get; set; }
    public string DescricaoOrigemDestino { get; set; }
    public bool? Status { get; set; }
}
```

## Observações Importantes

1. O campo `idOrigemDestino` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `nomeOrigemDestino` é obrigatório e deve ser único no sistema.
3. O campo `status` indica se a origem/destino está ativa ou inativa no sistema.
4. O endpoint `PATCH /api/VisitasOrigemDestino/UpdateStatus/{id}` alterna automaticamente o status atual da origem/destino.
5. Todas as requisições a esta API requerem autenticação com token JWT.
6. É recomendável manter as origens/destinos inativas ao invés de excluí-las, caso já tenham sido utilizadas em registros de visitas. 