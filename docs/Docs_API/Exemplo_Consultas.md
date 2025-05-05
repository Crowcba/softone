# Exemplos de Consultas para a API de Visitas Profissionais

Este documento fornece exemplos práticos de consultas à API de Visitas Profissionais usando diferentes ferramentas.

## Exemplos com cURL

### Listar todos os profissionais

```bash
curl -X GET "https://seu-servidor/api/VisitasProfissionais" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Obter um profissional específico

```bash
curl -X GET "https://seu-servidor/api/VisitasProfissionais/1" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo profissional

```bash
curl -X POST "https://seu-servidor/api/VisitasProfissionais" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "nomeProfissional": "Dr. Carlos Oliveira",
           "sexoProfissional": "M",
           "dataNascimentoProfissional": "1975-08-15",
           "profissaoProfissional": "Médico",
           "especialidadeProfissional": "Ortopedia",
           "conselhoProfissional": "CRM",
           "numeroConselhoProfissional": "98765",
           "emailProfissional": "carlos.oliveira@exemplo.com",
           "idPromotor": "5",
           "status": true
         }'
```

### Atualizar um profissional

```bash
curl -X PUT "https://seu-servidor/api/VisitasProfissionais/3" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idProfissional": 3,
           "nomeProfissional": "Dr. Carlos Oliveira",
           "sexoProfissional": "M",
           "dataNascimentoProfissional": "1975-08-15",
           "profissaoProfissional": "Médico",
           "especialidadeProfissional": "Ortopedia e Traumatologia",
           "conselhoProfissional": "CRM",
           "numeroConselhoProfissional": "98765",
           "emailProfissional": "carlos.oliveira@hospital.com",
           "idPromotor": "5",
           "idConselho": 1,
           "idEstadoConselho": 1,
           "status": true
         }'
```

### Excluir um profissional

```bash
curl -X DELETE "https://seu-servidor/api/VisitasProfissionais/3" \
     -H "Authorization: Bearer seu-token"
```

### Atualizar apenas o status

```bash
curl -X PATCH "https://seu-servidor/api/VisitasProfissionais/status/2" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d 'false'
```

### Atualizar apenas o promotor

```bash
curl -X PATCH "https://seu-servidor/api/VisitasProfissionais/promotor/2" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '"7"'
```

## Exemplos com JavaScript (Fetch API)

### Listar todos os profissionais

```javascript
fetch('https://seu-servidor/api/VisitasProfissionais', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

### Cadastrar um novo profissional

```javascript
const novoProfissional = {
  nomeProfissional: "Dra. Ana Ferreira",
  sexoProfissional: "F",
  dataNascimentoProfissional: "1982-03-20",
  profissaoProfissional: "Médica",
  especialidadeProfissional: "Pediatria",
  conselhoProfissional: "CRM",
  numeroConselhoProfissional: "76543",
  emailProfissional: "ana.ferreira@exemplo.com",
  idPromotor: "3",
  status: true
};

fetch('https://seu-servidor/api/VisitasProfissionais', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoProfissional)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Exemplos com C# (HttpClient)

### Listar todos os profissionais

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public class VisitasProfissionaisClient
{
    private readonly HttpClient _client;
    
    public VisitasProfissionaisClient(string token)
    {
        _client = new HttpClient();
        _client.BaseAddress = new Uri("https://seu-servidor/");
        _client.DefaultRequestHeaders.Accept.Clear();
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
    
    public async Task<string> ListarProfissionais()
    {
        HttpResponseMessage response = await _client.GetAsync("api/VisitasProfissionais");
        
        if (response.IsSuccessStatusCode)
        {
            return await response.Content.ReadAsStringAsync();
        }
        
        return $"Erro: {response.StatusCode}";
    }
}
```

### Cadastrar um novo profissional

```csharp
public async Task<string> CadastrarProfissional()
{
    var novoProfissional = new
    {
        nomeProfissional = "Dr. Ricardo Silva",
        sexoProfissional = "M",
        dataNascimentoProfissional = "1970-12-10",
        profissaoProfissional = "Médico",
        especialidadeProfissional = "Dermatologia",
        conselhoProfissional = "CRM",
        numeroConselhoProfissional = "12378",
        emailProfissional = "ricardo.silva@exemplo.com",
        idPromotor = "4",
        status = true
    };
    
    var content = new StringContent(
        JsonConvert.SerializeObject(novoProfissional),
        Encoding.UTF8,
        "application/json");
    
    HttpResponseMessage response = await _client.PostAsync("api/VisitasProfissionais", content);
    
    if (response.IsSuccessStatusCode)
    {
        return await response.Content.ReadAsStringAsync();
    }
    
    return $"Erro: {response.StatusCode}";
}
```

## Boas Práticas

1. **Sempre inclua autenticação**: Todas as requisições devem incluir o cabeçalho de autenticação Bearer.

2. **Trate erros adequadamente**: Sempre verifique o código de status da resposta e trate erros apropriadamente.

3. **Valide os dados**: Antes de enviar dados para a API, certifique-se de que eles estão no formato correto.

4. **Use compressão quando disponível**: Para grandes conjuntos de dados, considere habilitar a compressão para melhorar o desempenho.

5. **Implemente timeout adequado**: Configure um timeout adequado para suas requisições HTTP para evitar bloqueios prolongados. 