# Documentação da API de Agendas de Visitas

Esta documentação descreve como utilizar a API de Agendas de Visitas no sistema SoftOne, que permite gerenciar agendamentos de visitas a prescritores.

## Base URL

```
https://[seu-servidor]/api/VisitasAgendas
```

## Endpoints Disponíveis

### 1. Listar Todas as Agendas de Visitas

**Endpoint:** `GET /api/VisitasAgendas`

**Descrição:** Retorna uma lista de todas as agendas de visitas cadastradas no sistema, ordenadas pela data de criação (mais recentes primeiro).

**Autenticação:** Requer token JWT válido.

**Exemplo de Resposta:**
```json
[
  {
    "id": 42,
    "idPrescritor": 153,
    "idEndereco": 78,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "data": "15/05/2025",
    "descricao": "Apresentação do novo produto",
    "produto": 12,
    "ativo": true,
    "status": 1,
    "periodo": 2
  },
  {
    "id": 41,
    "idPrescritor": 125,
    "idEndereco": 65,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "data": "10/05/2025",
    "descricao": "Acompanhamento mensal",
    "produto": 8,
    "ativo": true,
    "status": 2,
    "periodo": 1
  }
]
```

### 2. Obter Agenda por ID

**Endpoint:** `GET /api/VisitasAgendas/{id}`

**Descrição:** Retorna os detalhes de uma agenda específica pelo ID.

**Autenticação:** Requer token JWT válido.

**Parâmetros**:
  - `id` (na URL): ID da agenda a ser obtida

**Exemplo de Resposta:**
```json
{
  "id": 42,
  "idPrescritor": 153,
  "idEndereco": 78,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "data": "15/05/2025",
  "descricao": "Apresentação do novo produto",
  "produto": 12,
  "ativo": true,
  "status": 1,
  "periodo": 2
}
```

### 3. Obter Agendas por Prescritor

**Endpoint:** `GET /api/VisitasAgendas/prescritor/{idPrescritor}`

**Descrição:** Retorna todas as agendas associadas a um prescritor específico, ordenadas pela data de criação (mais recentes primeiro).

**Autenticação:** Requer token JWT válido.

**Parâmetros**:
  - `idPrescritor` (na URL): ID do prescritor

**Exemplo de Resposta:**
```json
[
  {
    "id": 42,
    "idPrescritor": 153,
    "idEndereco": 78,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "data": "15/05/2025",
    "descricao": "Apresentação do novo produto",
    "produto": 12,
    "ativo": true,
    "status": 1,
    "periodo": 2
  },
  {
    "id": 39,
    "idPrescritor": 153,
    "idEndereco": 92,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "data": "20/04/2025",
    "descricao": "Visita de acompanhamento",
    "produto": 5,
    "ativo": true,
    "status": 3,
    "periodo": 1
  }
]
```

### 4. Criar Nova Agenda

**Endpoint:** `POST /api/VisitasAgendas`

**Descrição:** Cria um novo registro de agenda de visita no sistema.

**Autenticação:** Requer token JWT válido.

**Payload:** O corpo da requisição deve conter os dados da agenda conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "idPrescritor": 153,
  "idEndereco": 78,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "data": "25/05/2025",
  "descricao": "Apresentação de novidades",
  "produto": 12,
  "ativo": true,
  "status": 1,
  "periodo": 2
}
```

**Campos obrigatórios:**
- `idPrescritor`: ID do prescritor relacionado à visita
- `status`: Status da agenda (1 = Agendado, 2 = Confirmado, 3 = Realizado, 4 = Cancelado, etc.)

**Campos opcionais:**
- `idEndereco`: ID do endereço relacionado à visita
- `idUsuario`: ID do usuário responsável pela agenda
- `data`: Data prevista para a visita (formato string)
- `descricao`: Descrição ou propósito da visita
- `produto`: ID do produto relacionado à visita
- `ativo`: Indica se a agenda está ativa (true/false)
- `periodo`: Período da visita (1 = Manhã, 2 = Tarde, 3 = Noite)

**Exemplo de Resposta:**
```json
{
  "id": 43,
  "idPrescritor": 153,
  "idEndereco": 78,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "data": "25/05/2025",
  "descricao": "Apresentação de novidades",
  "produto": 12,
  "ativo": true,
  "status": 1,
  "periodo": 2
}
```

### 5. Atualizar Agenda

**Endpoint:** `PUT /api/VisitasAgendas/{id}`

**Descrição:** Atualiza os dados de uma agenda existente.

**Autenticação:** Requer token JWT válido.

**Parâmetros**:
  - `id` (na URL): ID da agenda a ser atualizada

**Payload:** O corpo da requisição deve conter os dados atualizados da agenda conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "id": 42,
  "idPrescritor": 153,
  "idEndereco": 78,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "data": "16/05/2025",
  "descricao": "Apresentação do novo produto atualizada",
  "produto": 12,
  "ativo": true,
  "status": 2,
  "periodo": 1
}
```

**Observação:** O ID no corpo da requisição deve corresponder ao ID na URL.

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

### 6. Excluir Agenda

**Endpoint:** `DELETE /api/VisitasAgendas/{id}`

**Descrição:** Remove uma agenda do sistema.

**Autenticação:** Requer token JWT válido.

**Parâmetros**:
  - `id` (na URL): ID da agenda a ser removida

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

### 7. Atualizar Status da Agenda

**Endpoint:** `PATCH /api/VisitasAgendas/status/{id}`

**Descrição:** Atualiza apenas o status de uma agenda existente.

**Autenticação:** Requer token JWT válido.

**Parâmetros**:
  - `id` (na URL): ID da agenda a ser atualizada

**Payload:** O corpo da requisição deve conter apenas o novo valor de status.

**Exemplo de Requisição:**
```json
2
```

**Significado dos status:**
- 1: Agendado
- 2: Confirmado
- 3: Realizado
- 4: Cancelado

**Exemplo de Resposta:**
```json
2
```

### 8. Atualizar Status de Ativo da Agenda

**Endpoint:** `PATCH /api/VisitasAgendas/ativo/{id}`

**Descrição:** Atualiza apenas o status de ativo de uma agenda existente.

**Autenticação:** Requer token JWT válido.

**Parâmetros**:
  - `id` (na URL): ID da agenda a ser atualizada

**Payload:** O corpo da requisição deve conter apenas o novo valor booleano.

**Exemplo de Requisição:**
```json
false
```

**Exemplo de Resposta:**
```json
false
```

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todas as agendas

```bash
curl -X GET "https://seu-servidor/api/VisitasAgendas" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar uma nova agenda

```bash
curl -X POST "https://seu-servidor/api/VisitasAgendas" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idPrescritor": 153,
           "idEndereco": 78,
           "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
           "data": "25/05/2025",
           "descricao": "Apresentação de novidades",
           "produto": 12,
           "ativo": true,
           "status": 1,
           "periodo": 2
         }'
```

### Atualizar o status de uma agenda

```bash
curl -X PATCH "https://seu-servidor/api/VisitasAgendas/status/42" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '2'
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todas as agendas
fetch('https://seu-servidor/api/VisitasAgendas', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Cadastrar uma nova agenda
const novaAgenda = {
  idPrescritor: 153,
  idEndereco: 78,
  idUsuario: "8e445865-a24d-4543-a6c6-9443d048cdb9",
  data: "25/05/2025",
  descricao: "Apresentação de novidades",
  produto: 12,
  ativo: true,
  status: 1,
  periodo: 2
};

fetch('https://seu-servidor/api/VisitasAgendas', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novaAgenda)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `id` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `idPrescritor` é obrigatório e deve referenciar um prescritor existente no sistema.
3. O campo `status` utiliza valores numéricos para representar os diferentes estados da agenda.
4. O campo `periodo` utiliza valores numéricos para representar os diferentes períodos do dia (1 = Manhã, 2 = Tarde, 3 = Noite).
5. Todas as requisições a esta API requerem autenticação com token JWT.
6. A data da agenda é armazenada como string e não como timestamp, é importante manter o formato consistente.
7. Para obter todas as agendas de um prescritor específico, utilize o endpoint `/prescritor/{idPrescritor}`.