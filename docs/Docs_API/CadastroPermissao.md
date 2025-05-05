# Documentação da API de Permissões

Esta documentação descreve como utilizar a API de Permissões no sistema SoftOne, que permite gerenciar as permissões de acesso dos usuários aos módulos do sistema.

## Base URL

```
https://[seu-servidor]/api/CadastroPermissao
```

## Endpoints Disponíveis

### 1. Listar Todas as Permissões

**Endpoint:** `GET /api/CadastroPermissao`

**Descrição:** Retorna uma lista de todas as permissões cadastradas no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "idModulo": 1,
    "status": true
  },
  {
    "id": 2,
    "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "idModulo": 2,
    "status": true
  }
]
```

### 2. Obter Permissão por ID

**Endpoint:** `GET /api/CadastroPermissao/{id}`

**Descrição:** Retorna os detalhes de uma permissão específica pelo ID.

**Exemplo de Resposta:**
```json
{
  "id": 1,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idModulo": 1,
  "status": true
}
```

### 3. Listar Permissões por Usuário

**Endpoint:** `GET /api/CadastroPermissao/usuario/{idUsuario}`

**Descrição:** Retorna uma lista de permissões e módulos associados a um usuário específico pelo ID do usuário. Este endpoint retorna apenas as permissões ativas (status = true) para módulos ativos.

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "id_usuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "id_modulo": 1,
    "status": true,
    "nome": "Gestão de Usuários"
  },
  {
    "id": 2,
    "id_usuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "id_modulo": 2,
    "status": true,
    "nome": "Financeiro"
  }
]
```

**Observação:** Este endpoint retorna um objeto enriquecido com o nome do módulo, unindo as tabelas de permissões e módulos. Apenas permissões ativas (status = true) para módulos ativos são retornadas.

### 4. Criar Nova Permissão

**Endpoint:** `POST /api/CadastroPermissao`

**Descrição:** Cria uma nova permissão no sistema.

**Payload:** O corpo da requisição deve conter os dados da permissão conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idModulo": 3,
  "status": true
}
```

**Exemplo de Resposta:**
```json
{
  "id": 3,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idModulo": 3,
  "status": true
}
```

### 5. Atualizar Permissão

**Endpoint:** `PUT /api/CadastroPermissao/{id}`

**Descrição:** Atualiza os dados de uma permissão existente.

**Payload:** O corpo da requisição deve conter todos os dados da permissão, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "id": 3,
  "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idModulo": 3,
  "status": false
}
```

### 6. Excluir Permissão

**Endpoint:** `DELETE /api/CadastroPermissao/{id}`

**Descrição:** Remove uma permissão do sistema.

### 7. Atualizar Status da Permissão

**Endpoint:** `PATCH /api/CadastroPermissao/{id}/status`

**Descrição:** Atualiza apenas o status de uma permissão existente.

**Payload:** O corpo da requisição deve conter um valor booleano que representa o novo status.

**Exemplo de Requisição:**
```json
true
```

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar permissões de um usuário

```bash
curl -X GET "https://seu-servidor/api/CadastroPermissao/usuario/8e445865-a24d-4543-a6c6-9443d048cdb9" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar uma nova permissão

```bash
curl -X POST "https://seu-servidor/api/CadastroPermissao" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idUsuario": "8e445865-a24d-4543-a6c6-9443d048cdb9",
           "idModulo": 4,
           "status": true
         }'
```

### Atualizar o status de uma permissão

```bash
curl -X PATCH "https://seu-servidor/api/CadastroPermissao/3/status" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d 'false'
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar permissões de um usuário
fetch('https://seu-servidor/api/CadastroPermissao/usuario/8e445865-a24d-4543-a6c6-9443d048cdb9', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Criar nova permissão
const novaPermissao = {
  idUsuario: "8e445865-a24d-4543-a6c6-9443d048cdb9",
  idModulo: 5,
  status: true
};

fetch('https://seu-servidor/api/CadastroPermissao', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novaPermissao)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Atualizar status de uma permissão
fetch('https://seu-servidor/api/CadastroPermissao/3/status', {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(false)
})
.then(response => {
  if (response.ok) {
    console.log('Status atualizado com sucesso');
  }
})
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `id` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `idUsuario` é obrigatório e deve referenciar um usuário existente no sistema.
3. O campo `idModulo` é obrigatório e deve referenciar um módulo existente no sistema.
4. O campo `status` indica se a permissão está ativa ou inativa no sistema.
5. Todas as requisições a esta API requerem autenticação com token JWT.
6. O endpoint `/usuario/{idUsuario}` retorna apenas permissões ativas para módulos ativos.
7. A API não permite a criação de permissões duplicadas para o mesmo usuário e módulo.