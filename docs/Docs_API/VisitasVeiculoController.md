# Documentação da API de Veículos

Esta documentação descreve como utilizar a API de Veículos no sistema SoftOne, que permite gerenciar os veículos utilizados nas visitas.

## Base URL

```
https://[seu-servidor]/api/VisitasVeiculo
```

## Endpoints Disponíveis

### 1. Listar Todos os Veículos

**Endpoint:** `GET /api/VisitasVeiculo`

**Descrição:** Retorna uma lista de todos os veículos cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "idVeiculo": 1,
    "idUsername": "usuario.exemplo",
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "placaVeiculo": "ABC1234",
    "marcaModeloVeiculo": "Toyota Corolla",
    "modeloVeiculo": "Corolla",
    "corVeiculo": "Prata",
    "proprietarioVeiculo": "Maria Silva",
    "ativo": true
  },
  {
    "idVeiculo": 2,
    "idUsername": "outro.usuario",
    "idUsuario": "7f335764-b23c-4541-a5c5-8332c047cda8",
    "placaVeiculo": "XYZ5678",
    "marcaModeloVeiculo": "Honda Civic",
    "modeloVeiculo": "Civic",
    "corVeiculo": "Preto",
    "proprietarioVeiculo": "João Santos",
    "ativo": true
  }
]
```

### 2. Obter Veículo por ID

**Endpoint:** `GET /api/VisitasVeiculo/{id}`

**Descrição:** Retorna os detalhes de um veículo específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "idVeiculo": 1,
  "idUsername": "usuario.exemplo",
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "placaVeiculo": "ABC1234",
  "marcaModeloVeiculo": "Toyota Corolla",
  "modeloVeiculo": "Corolla",
  "corVeiculo": "Prata",
  "proprietarioVeiculo": "Maria Silva",
  "ativo": true
}
```

### 3. Obter Veículos por Usuário

**Endpoint:** `GET /api/VisitasVeiculo/usuario/{idUsuario}`

**Descrição:** Retorna todos os veículos associados a um usuário específico.

**Exemplo de Resposta:**
```json
[
  {
    "idVeiculo": 1,
    "idUsername": "usuario.exemplo",
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "placaVeiculo": "ABC1234",
    "marcaModeloVeiculo": "Toyota Corolla",
    "modeloVeiculo": "Corolla",
    "corVeiculo": "Prata",
    "proprietarioVeiculo": "Maria Silva",
    "ativo": true
  },
  {
    "idVeiculo": 3,
    "idUsername": "usuario.exemplo",
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "placaVeiculo": "DEF5678",
    "marcaModeloVeiculo": "Volkswagen Golf",
    "modeloVeiculo": "Golf",
    "corVeiculo": "Branco",
    "proprietarioVeiculo": "Maria Silva",
    "ativo": false
  }
]
```

**Observação:** Se o usuário não tiver veículos cadastrados, será retornada uma lista vazia.

### 4. Criar Novo Veículo

**Endpoint:** `POST /api/VisitasVeiculo`

**Descrição:** Cria um novo registro de veículo no sistema.

**Payload:** O corpo da requisição deve conter os dados do veículo conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "idUsername": "usuario.exemplo",
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "placaVeiculo": "GHI9012",
  "marcaModeloVeiculo": "Fiat Argo",
  "modeloVeiculo": "Argo",
  "corVeiculo": "Vermelho",
  "proprietarioVeiculo": "Carlos Souza",
  "ativo": true
}
```

**Campos obrigatórios:**
- `placaVeiculo`: Placa do veículo

**Campos opcionais:**
- `idUsername`: Nome de usuário do proprietário
- `idUsuario`: ID do usuário proprietário
- `marcaModeloVeiculo`: Marca e modelo combinados
- `modeloVeiculo`: Apenas o modelo
- `corVeiculo`: Cor do veículo
- `proprietarioVeiculo`: Nome do proprietário
- `ativo`: Status de ativo (padrão: true)

**Exemplo de Resposta:**
```json
{
  "idVeiculo": 4,
  "idUsername": "usuario.exemplo",
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "placaVeiculo": "GHI9012",
  "marcaModeloVeiculo": "Fiat Argo",
  "modeloVeiculo": "Argo",
  "corVeiculo": "Vermelho",
  "proprietarioVeiculo": "Carlos Souza",
  "ativo": true
}
```

### 5. Atualizar Veículo

**Endpoint:** `PUT /api/VisitasVeiculo/{id}`

**Descrição:** Atualiza os dados de um veículo existente.

**Payload:** O corpo da requisição deve conter todos os dados do veículo, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "idUsername": "usuario.exemplo",
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "placaVeiculo": "GHI9012",
  "marcaModeloVeiculo": "Fiat Argo Drive",
  "modeloVeiculo": "Argo",
  "corVeiculo": "Vermelho Metálico",
  "proprietarioVeiculo": "Carlos Souza",
  "ativo": true
}
```

**Campos obrigatórios:**
- `placaVeiculo`: Placa do veículo

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

### 6. Excluir Veículo

**Endpoint:** `DELETE /api/VisitasVeiculo/{id}`

**Descrição:** Remove um veículo do sistema.

**Exemplo de Resposta:** Código 204 (No Content) sem corpo de resposta.

### 7. Alternar Status Ativo do Veículo

**Endpoint:** `PATCH /api/VisitasVeiculo/{id}/toggle-ativo`

**Descrição:** Alterna o status ativo/inativo de um veículo existente.

**Observação:** Este endpoint não requer payload, pois ele inverte automaticamente o status atual.

**Exemplo de Resposta:**
```json
{
  "idVeiculo": 4,
  "idUsername": "usuario.exemplo",
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "placaVeiculo": "GHI9012",
  "marcaModeloVeiculo": "Fiat Argo Drive",
  "modeloVeiculo": "Argo",
  "corVeiculo": "Vermelho Metálico",
  "proprietarioVeiculo": "Carlos Souza",
  "ativo": false
}
```

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar todos os veículos

```bash
curl -X GET "https://seu-servidor/api/VisitasVeiculo" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo veículo

```bash
curl -X POST "https://seu-servidor/api/VisitasVeiculo" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idUsername": "usuario.exemplo",
           "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
           "placaVeiculo": "JKL3456",
           "marcaModeloVeiculo": "Chevrolet Onix",
           "modeloVeiculo": "Onix",
           "corVeiculo": "Azul",
           "proprietarioVeiculo": "Ana Lima",
           "ativo": true
         }'
```

### Alternar o status ativo de um veículo

```bash
curl -X PATCH "https://seu-servidor/api/VisitasVeiculo/4/toggle-ativo" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar todos os veículos
fetch('https://seu-servidor/api/VisitasVeiculo', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Cadastrar um novo veículo
const novoVeiculo = {
  idUsername: "usuario.exemplo",
  idUsuario: "8e445865-a24d-4543-a6c6-9443d048cdb9",
  placaVeiculo: "MNO7890",
  marcaModeloVeiculo: "Hyundai HB20",
  modeloVeiculo: "HB20",
  corVeiculo: "Cinza",
  proprietarioVeiculo: "Roberto Alves",
  ativo: true
};

fetch('https://seu-servidor/api/VisitasVeiculo', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoVeiculo)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Alternar o status ativo de um veículo
fetch('https://seu-servidor/api/VisitasVeiculo/5/toggle-ativo', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `idVeiculo` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `placaVeiculo` é o único campo obrigatório para criar ou atualizar um veículo.
3. O campo `ativo` indica se o veículo está ativo ou inativo no sistema. Se não informado na criação, será considerado como `true`.
4. O endpoint `PATCH /api/VisitasVeiculo/{id}/toggle-ativo` alterna automaticamente o status atual do veículo.
5. Todas as requisições a esta API requerem autenticação com token JWT.
6. Os campos `idUsername` e `idUsuario` são usados para identificar o proprietário do veículo no sistema.
