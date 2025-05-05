# Documentação da API de Telefones de Profissionais

Esta documentação descreve como utilizar a API de Telefones de Profissionais no sistema SoftOne, que permite gerenciar os telefones associados a profissionais.

## Base URL

```
https://[seu-servidor]/api/VisitasProfissionalTelefone
```

## Endpoints Disponíveis

### 1. Listar Todos os Telefones

**Endpoint:** `GET /api/VisitasProfissionalTelefone`

**Descrição:** Retorna uma lista de todos os telefones cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "idTelefone": 1,
    "idProfissional": 1,
    "numeroTelefone": "(11) 98765-4321",
    "nomeDaSecretariaTelefone": "Maria",
    "principal": true,
    "whatsapp": false
  },
  {
    "idTelefone": 2,
    "idProfissional": 1,
    "numeroTelefone": "(11) 97654-3210",
    "nomeDaSecretariaTelefone": "Não Informado",
    "principal": false,
    "whatsapp": true
  }
]
```

### 2. Obter Telefone por ID

**Endpoint:** `GET /api/VisitasProfissionalTelefone/{id}`

**Descrição:** Retorna os detalhes de um telefone específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "idTelefone": 1,
  "idProfissional": 1,
  "numeroTelefone": "(11) 98765-4321",
  "nomeDaSecretariaTelefone": "Maria",
  "principal": true,
  "whatsapp": false
}
```

### 3. Criar Novo Telefone

**Endpoint:** `POST /api/VisitasProfissionalTelefone`

**Descrição:** Cria um novo registro de telefone no sistema.

**Importante:** O endpoint POST aceita APENAS os cinco campos abaixo. Qualquer outro campo será ignorado.

**Campos obrigatórios:**
- `idProfissional` (número)
- `numeroTelefone` (texto)

**Campos opcionais:**
- `nomeDaSecretariaTelefone` (texto, pode ser null ou omitido - será automaticamente definido como "Não Informado")
- `principal` (booleano, padrão: false)
- `whatsapp` (booleano, padrão: false)

**Exemplo de Requisição:**
```json
{
  "idProfissional": 1,
  "numeroTelefone": "(11) 99876-5432",
  "nomeDaSecretariaTelefone": "Ana",
  "principal": true,
  "whatsapp": false
}
```

**Exemplo de Requisição sem informar o nome da secretária:**
```json
{
  "idProfissional": 1,
  "numeroTelefone": "(11) 99876-5432",
  "principal": true,
  "whatsapp": false
}
```

**Resposta (o sistema define automaticamente "Não Informado"):**
```json
{
  "idTelefone": 3,
  "idProfissional": 1,
  "numeroTelefone": "(11) 99876-5432",
  "nomeDaSecretariaTelefone": "Não Informado",
  "principal": true,
  "whatsapp": false
}
```

**Comportamento:**
- Se o telefone for marcado como `principal`, todos os outros telefones do mesmo profissional serão automaticamente desmarcados.
- Se o telefone for marcado como `whatsapp`, todos os outros telefones do mesmo profissional serão automaticamente desmarcados.
- Se o campo `nomeDaSecretariaTelefone` não for informado ou for enviado como null, o sistema definirá automaticamente como "Não Informado".

**Exemplo de Resposta:**
```json
{
  "idTelefone": 3,
  "idProfissional": 1,
  "numeroTelefone": "(11) 99876-5432",
  "nomeDaSecretariaTelefone": "Ana",
  "principal": true,
  "whatsapp": false
}
```

### 4. Atualizar Telefone

**Endpoint:** `PUT /api/VisitasProfissionalTelefone/{id}`

**Descrição:** Atualiza os dados de um telefone existente.

**Importante:** O endpoint PUT usa o mesmo modelo simplificado do método POST, aceitando APENAS os cinco campos abaixo.

**Campos obrigatórios:**
- `idProfissional` (número)
- `numeroTelefone` (texto)

**Campos opcionais:**
- `nomeDaSecretariaTelefone` (texto, pode ser null ou omitido - será automaticamente definido como "Não Informado")
- `principal` (booleano, padrão: false)
- `whatsapp` (booleano, padrão: false)

**Exemplo de Requisição:**
```json
{
  "idProfissional": 1,
  "numeroTelefone": "(11) 99876-5432",
  "nomeDaSecretariaTelefone": "Ana Silva",
  "principal": true,
  "whatsapp": false
}
```

**Comportamento:**
- A API verifica se já existe um telefone com o ID especificado antes de fazer a atualização.
- Se o telefone for marcado como `principal` e não estava marcado anteriormente, todos os outros telefones do mesmo profissional serão automaticamente desmarcados.
- Se o telefone for marcado como `whatsapp` e não estava marcado anteriormente, todos os outros telefones do mesmo profissional serão automaticamente desmarcados.
- Se o campo `nomeDaSecretariaTelefone` não for informado ou for enviado como null, o sistema definirá automaticamente como "Não Informado".

### 5. Excluir Telefone

**Endpoint:** `DELETE /api/VisitasProfissionalTelefone/{id}`

**Descrição:** Remove um telefone do sistema.

### 6. Atualizar Status Principal do Telefone

**Endpoint:** `PATCH /api/VisitasProfissionalTelefone/principal/{id}`

**Descrição:** Atualiza apenas o status de telefone principal. Quando um telefone é marcado como principal, os outros telefones do mesmo profissional serão automaticamente desmarcados.

**Payload:** O corpo da requisição deve conter um valor booleano que representa o novo status.

**Exemplo de Requisição:**
```json
true
```

### 7. Atualizar Status WhatsApp do Telefone

**Endpoint:** `PATCH /api/VisitasProfissionalTelefone/whatsapp/{id}`

**Descrição:** Atualiza apenas o status de WhatsApp do telefone. Quando um telefone é marcado como WhatsApp, os outros telefones do mesmo profissional serão automaticamente desmarcados.

**Payload:** O corpo da requisição deve conter um valor booleano que representa o novo status.

**Exemplo de Requisição:**
```json
true
```

### 8. Obter Telefones por Profissional

**Endpoint:** `GET /api/VisitasProfissionalTelefone/profissional/{idProfissional}`

**Descrição:** Retorna todos os telefones associados a um profissional específico.

**Exemplo de Resposta:**
```json
[
  {
    "idTelefone": 1,
    "idProfissional": 1,
    "numeroTelefone": "(11) 98765-4321",
    "nomeDaSecretariaTelefone": "Maria",
    "principal": true,
    "whatsapp": false
  },
  {
    "idTelefone": 2,
    "idProfissional": 1,
    "numeroTelefone": "(11) 97654-3210",
    "nomeDaSecretariaTelefone": "Não Informado",
    "principal": false,
    "whatsapp": true
  }
]
```

**Observação:** Se o profissional não tiver telefones cadastrados, será retornada uma lista vazia.

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todos os telefones

```bash
curl -X GET "https://seu-servidor/api/VisitasProfissionalTelefone" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo telefone

```bash
curl -X POST "https://seu-servidor/api/VisitasProfissionalTelefone" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idProfissional": 1,
           "numeroTelefone": "(11) 99876-5432",
           "nomeDaSecretariaTelefone": null,
           "principal": true,
           "whatsapp": false
         }'
```

### Atualizar um telefone existente

```bash
curl -X PUT "https://seu-servidor/api/VisitasProfissionalTelefone/3" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idProfissional": 1,
           "numeroTelefone": "(11) 99876-5432",
           "nomeDaSecretariaTelefone": "Ana Silva",
           "principal": true,
           "whatsapp": false
         }'
```

### Marcar telefone como principal

```bash
curl -X PATCH "https://seu-servidor/api/VisitasProfissionalTelefone/principal/3" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d 'true'
```

### Marcar telefone como WhatsApp

```bash
curl -X PATCH "https://seu-servidor/api/VisitasProfissionalTelefone/whatsapp/3" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d 'true'
```

### Obter telefones de um profissional específico

```bash
curl -X GET "https://seu-servidor/api/VisitasProfissionalTelefone/profissional/1" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todos os telefones
fetch('https://seu-servidor/api/VisitasProfissionalTelefone', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Criar um novo telefone
fetch('https://seu-servidor/api/VisitasProfissionalTelefone', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    idProfissional: 1,
    numeroTelefone: "(11) 99876-5432",
    // nomeDaSecretariaTelefone omitido - será definido como "Não Informado"
    principal: true,
    whatsapp: false
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Atualizar um telefone existente
fetch('https://seu-servidor/api/VisitasProfissionalTelefone/3', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    idProfissional: 1,
    numeroTelefone: "(11) 99876-5432",
    nomeDaSecretariaTelefone: "Ana Silva",
    principal: true,
    whatsapp: false
  })
})
.then(response => {
  if (response.ok) {
    console.log('Telefone atualizado com sucesso');
  }
})
.catch(error => console.error('Erro:', error));

// Marcar telefone como principal
fetch('https://seu-servidor/api/VisitasProfissionalTelefone/principal/3', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(true)
})
.then(response => {
  if (response.ok) {
    console.log('Telefone marcado como principal com sucesso');
  }
})
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `idTelefone` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `idProfissional` é obrigatório e deve referenciar um profissional existente no sistema.
3. O campo `numeroTelefone` é obrigatório e deve conter um número de telefone válido.
4. O campo `nomeDaSecretariaTelefone` é opcional. Se não for informado ou for enviado como null, será automaticamente definido como "Não Informado".
5. O campo `principal` indica se este é o telefone principal do profissional. Apenas um telefone pode ser marcado como principal por profissional.
6. O campo `whatsapp` indica se este telefone é um número de WhatsApp. Apenas um telefone pode ser marcado como WhatsApp por profissional.
7. **Nota Técnica:** No banco de dados, o campo de WhatsApp está definido como `wathsapp` (com erro de digitação), mas na API é referenciado como `whatsapp`. Essa inconsistência é tratada internamente pelo Entity Framework.
8. Todas as requisições a esta API requerem autenticação com token JWT.