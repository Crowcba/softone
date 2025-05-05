# Documentação da API de Prescritores

Esta documentação descreve como utilizar a API de Prescritores no sistema SoftOne, que permite gerenciar os prescritores associados a listas.

## Base URL

```
https://[seu-servidor]/api/VisitasPrescritoresListum
```

## Endpoints Disponíveis

### 1. Listar Todos os Prescritores

**Endpoint:** `GET /api/VisitasPrescritoresListum`

**Descrição:** Retorna uma lista de todos os prescritores cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "idPrescritor": 123,
    "idLista": 10
  },
  {
    "id": 2,
    "idPrescritor": 456,
    "idLista": 10
  }
]
```

### 2. Obter Prescritor por ID

**Endpoint:** `GET /api/VisitasPrescritoresListum/{id}`

**Descrição:** Retorna os detalhes de um prescritor específico pelo ID.

**Parâmetros**:
  - `id` (na URL): ID do prescritor a ser obtido

**Exemplo de Resposta:**
```json
{
  "id": 1,
  "idPrescritor": 123,
  "idLista": 10
}
```

### 3. Obter Prescritores por Lista

**Endpoint:** `GET /api/VisitasPrescritoresListum/lista/{idLista}`

**Descrição:** Retorna todos os prescritores associados a uma lista específica.

**Parâmetros**:
  - `idLista` (na URL): ID da lista

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "idPrescritor": 123,
    "idLista": 10
  },
  {
    "id": 2,
    "idPrescritor": 456,
    "idLista": 10
  }
]
```

**Observação:** Se a lista não tiver prescritores cadastrados, será retornada uma lista vazia.

### 4. Obter Prescritores por ID do Prescritor

**Endpoint:** `GET /api/VisitasPrescritoresListum/prescritor/{idPrescritor}`

**Descrição:** Retorna todos os registros associados a um ID de prescritor específico.

**Parâmetros**:
  - `idPrescritor` (na URL): ID do prescritor

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "idPrescritor": 123,
    "idLista": 10
  },
  {
    "id": 3,
    "idPrescritor": 123,
    "idLista": 20
  }
]
```

**Observação:** Se não houver registros para o prescritor, será retornada uma lista vazia.

### 5. Criar Novo Prescritor

**Endpoint:** `POST /api/VisitasPrescritoresListum`

**Descrição:** Cria um novo registro de prescritor no sistema.

**Payload:** O corpo da requisição deve conter os dados do prescritor conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "idPrescritor": 789,
  "idLista": 20
}
```

**Campos obrigatórios:**
- `idPrescritor`: ID do prescritor relacionado
- `idLista`: ID da lista relacionada

**Exemplo de Resposta:**
```json
{
  "id": 4,
  "idPrescritor": 789,
  "idLista": 20
}
```

### 6. Atualizar Prescritor

**Endpoint:** `PUT /api/VisitasPrescritoresListum/{id}`

**Descrição:** Atualiza os dados de um prescritor existente.

**Parâmetros**:
  - `id` (na URL): ID do prescritor a ser atualizado

**Payload:** O corpo da requisição deve conter os dados do prescritor conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "idPrescritor": 123,
  "idLista": 30
}
```

**Campos obrigatórios:**
- `idPrescritor`: ID do prescritor relacionado
- `idLista`: ID da lista relacionada

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

### 7. Excluir Prescritor

**Endpoint:** `DELETE /api/VisitasPrescritoresListum/{id}`

**Descrição:** Remove um prescritor do sistema.

**Parâmetros**:
  - `id` (na URL): ID do prescritor a ser removido

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todos os prescritores

```bash
curl -X GET "https://seu-servidor/api/VisitasPrescritoresListum" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo prescritor

```bash
curl -X POST "https://seu-servidor/api/VisitasPrescritoresListum" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idPrescritor": 789,
           "idLista": 20
         }'
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todos os prescritores
fetch('https://seu-servidor/api/VisitasPrescritoresListum', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Cadastrar um novo prescritor
const novoPrescritor = {
  idPrescritor: 789,
  idLista: 20
};

fetch('https://seu-servidor/api/VisitasPrescritoresListum', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoPrescritor)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `id` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `idPrescritor` é obrigatório e deve referenciar um prescritor existente no sistema.
3. O campo `idLista` é obrigatório e deve referenciar uma lista existente no sistema.
4. Todas as requisições a esta API requerem autenticação com token JWT.
5. Para obter todos os prescritores de uma lista específica, utilize o endpoint `/lista/{idLista}`.
6. Para obter todos os registros associados a um prescritor específico, utilize o endpoint `/prescritor/{idPrescritor}`.
