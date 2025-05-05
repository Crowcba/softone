# Documentação da API de Locais de Prescritores

Esta documentação descreve como utilizar a API de Locais de Prescritores no sistema SoftOne, que permite gerenciar os locais associados a prescritores.

## Base URL

```
https://[seu-servidor]/api/VisitasLocalPrescritoresListum
```

## Endpoints Disponíveis

### 1. Listar Todos os Locais de Prescritores

**Endpoint:** `GET /api/VisitasLocalPrescritoresListum`

**Descrição:** Retorna uma lista de todos os locais de prescritores cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "descricao": "Hospital Regional",
    "idLocal": 123,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
  },
  {
    "id": 2,
    "descricao": "Clínica Central",
    "idLocal": 456,
    "idUsuario": "7f335764-b23c-4541-a5c5-8332c047cda8"
  }
]
```

### 2. Obter Local de Prescritor por ID

**Endpoint:** `GET /api/VisitasLocalPrescritoresListum/{id}`

**Descrição:** Retorna os detalhes de um local de prescritor específico pelo ID.

**Parâmetros**:
  - `id` (na URL): ID do local de prescritor a ser obtido

**Exemplo de Resposta:**
```json
{
  "id": 1,
  "descricao": "Hospital Regional",
  "idLocal": 123,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
}
```

### 3. Obter Locais de Prescritores por Usuário

**Endpoint:** `GET /api/VisitasLocalPrescritoresListum/usuario/{idUsuario}`

**Descrição:** Retorna todos os locais de prescritores associados a um usuário específico.

**Parâmetros**:
  - `idUsuario` (na URL): ID do usuário

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "descricao": "Hospital Regional",
    "idLocal": 123,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
  },
  {
    "id": 3,
    "descricao": "Consultório Médico",
    "idLocal": 789,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
  }
]
```

**Observação:** Se o usuário não tiver locais cadastrados, será retornada uma lista vazia.

### 4. Criar Novo Local de Prescritor

**Endpoint:** `POST /api/VisitasLocalPrescritoresListum`

**Descrição:** Cria um novo registro de local de prescritor no sistema.

**Payload:** O corpo da requisição deve conter os dados do local de prescritor conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "descricao": "Novo Hospital",
  "idLocal": 567,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
}
```

**Campos obrigatórios:**
- `idLocal`: ID do local relacionado

**Campos opcionais:**
- `descricao`: Descrição do local de prescritor
- `idUsuario`: ID do usuário associado

**Exemplo de Resposta:**
```json
{
  "id": 4,
  "descricao": "Novo Hospital",
  "idLocal": 567,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
}
```

### 5. Atualizar Local de Prescritor

**Endpoint:** `PUT /api/VisitasLocalPrescritoresListum/{id}`

**Descrição:** Atualiza os dados de um local de prescritor existente.

**Parâmetros**:
  - `id` (na URL): ID do local de prescritor a ser atualizado

**Payload:** O corpo da requisição deve conter os dados do local de prescritor conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "descricao": "Hospital Regional Atualizado",
  "idLocal": 123,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
}
```

**Campos obrigatórios:**
- `idLocal`: ID do local relacionado

**Campos opcionais:**
- `descricao`: Descrição do local de prescritor
- `idUsuario`: ID do usuário associado

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

### 6. Excluir Local de Prescritor

**Endpoint:** `DELETE /api/VisitasLocalPrescritoresListum/{id}`

**Descrição:** Remove um local de prescritor do sistema.

**Parâmetros**:
  - `id` (na URL): ID do local de prescritor a ser removido

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todos os locais de prescritores

```bash
curl -X GET "https://seu-servidor/api/VisitasLocalPrescritoresListum" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo local de prescritor

```bash
curl -X POST "https://seu-servidor/api/VisitasLocalPrescritoresListum" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "descricao": "Novo Hospital",
           "idLocal": 567,
           "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9"
         }'
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todos os locais de prescritores
fetch('https://seu-servidor/api/VisitasLocalPrescritoresListum', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Cadastrar um novo local de prescritor
const novoLocal = {
  descricao: "Centro Médico",
  idLocal: 789,
  idUsuario: "8e445865-a24d-4543-a6c6-9443d048cdb9"
};

fetch('https://seu-servidor/api/VisitasLocalPrescritoresListum', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoLocal)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `id` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `idLocal` é obrigatório e deve referenciar um local existente no sistema.
3. O campo `idUsuario` pode ser utilizado para associar o local a um usuário específico.
4. Todas as requisições a esta API requerem autenticação com token JWT.
5. Para obter todos os locais de prescritor de um usuário específico, utilize o endpoint `/usuario/{idUsuario}`.
