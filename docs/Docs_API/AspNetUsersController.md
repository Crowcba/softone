# Documentação da API de Usuários

Esta documentação descreve como utilizar a API de Usuários (AspNetUsers) no sistema SoftOne, que permite gerenciar os usuários da aplicação.

## Base URL

```
https://[seu-servidor]/api/AspNetUsers
```

## Endpoints Disponíveis

### 1. Listar Todos os Usuários

**Endpoint:** `GET /api/AspNetUsers`

**Descrição:** Retorna uma lista de todos os usuários cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "id": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "userName": "usuario.exemplo",
    "email": "usuario@exemplo.com",
    "nome": "Usuário Exemplo",
    "admissao": "2023-01-15T00:00:00",
    "ativo": true,
    "funcao": "Coordenador"
  },
  {
    "id": "7f335764-b23c-4541-a5c5-8332c047cda8",
    "userName": "outro.usuario",
    "email": "outro@exemplo.com",
    "nome": "Outro Usuário",
    "admissao": "2023-02-20T00:00:00",
    "ativo": true,
    "funcao": "Analista"
  }
]
```

### 2. Obter Usuário por ID

**Endpoint:** `GET /api/AspNetUsers/{id}`

**Descrição:** Retorna os detalhes de um usuário específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "id": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "userName": "usuario.exemplo",
  "email": "usuario@exemplo.com",
  "nome": "Usuário Exemplo",
  "admissao": "2023-01-15T00:00:00",
  "ativo": true,
  "funcao": "Coordenador"
}
```

### 3. Obter Usuário por Nome de Usuário

**Endpoint:** `GET /api/AspNetUsers/username/{username}`

**Descrição:** Retorna os detalhes de um usuário específico pelo nome de usuário (username).

**Exemplo de Resposta:**
```json
{
  "id": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "userName": "usuario.exemplo",
  "email": "usuario@exemplo.com",
  "nome": "Usuário Exemplo",
  "admissao": "2023-01-15T00:00:00",
  "ativo": true,
  "funcao": "Coordenador"
}
```

### 4. Listar Apenas Usuários Ativos

**Endpoint:** `GET /api/AspNetUsers/active`

**Descrição:** Retorna uma lista apenas dos usuários que estão marcados como ativos no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "id": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "userName": "usuario.exemplo",
    "email": "usuario@exemplo.com",
    "nome": "Usuário Exemplo",
    "admissao": "2023-01-15T00:00:00",
    "ativo": true,
    "funcao": "Coordenador"
  }
]
```

### 5. Obter Informações Resumidas do Usuário

**Endpoint:** `GET /api/AspNetUsers/infoUsuario/{userName}`

**Descrição:** Retorna informações resumidas de um usuário pelo nome de usuário, incluindo apenas os campos mais relevantes.

**Exemplo de Resposta:**
```json
{
  "id": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "userName": "usuario.exemplo",
  "passwordHash": "[hash-protegido]",
  "admissao": "2023-01-15T00:00:00",
  "nome": "Usuário Exemplo"
}
```

### 6. Criar Novo Usuário

**Endpoint:** `POST /api/AspNetUsers`

**Descrição:** Cria um novo registro de usuário no sistema.

**Payload:** O corpo da requisição deve conter os dados do usuário conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "userName": "novo.usuario",
  "email": "novo@exemplo.com",
  "nome": "Novo Usuário",
  "admissao": "2023-03-10",
  "ativo": true,
  "funcao": "Vendedor"
}
```

**Observação:** O ID do usuário será gerado automaticamente se não for fornecido.

**Exemplo de Resposta:**
```json
{
  "id": "6e225865-a24d-4543-a6c6-9443d048cdc7",
  "userName": "novo.usuario",
  "email": "novo@exemplo.com",
  "nome": "Novo Usuário",
  "admissao": "2023-03-10T00:00:00",
  "ativo": true,
  "funcao": "Vendedor"
}
```

### 7. Atualizar Usuário

**Endpoint:** `PUT /api/AspNetUsers/{id}`

**Descrição:** Atualiza os dados de um usuário existente.

**Payload:** O corpo da requisição deve conter todos os dados do usuário, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "id": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "userName": "usuario.exemplo",
  "email": "usuario.atualizado@exemplo.com",
  "nome": "Usuário Exemplo Atualizado",
  "admissao": "2023-01-15T00:00:00",
  "ativo": true,
  "funcao": "Gerente"
}
```

### 8. Desativar Usuário

**Endpoint:** `DELETE /api/AspNetUsers/{id}`

**Descrição:** Desativa um usuário existente (não exclui o registro do banco de dados).

**Observação:** Este endpoint apenas marca o usuário como inativo (ativo = false), sem removê-lo do sistema.

### 9. Reativar Usuário

**Endpoint:** `PATCH /api/AspNetUsers/activate/{id}`

**Descrição:** Reativa um usuário que estava desativado.

**Observação:** Este endpoint atualiza o status do usuário para ativo (ativo = true).

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito ao tentar criar um recurso que já existe
- `500 Internal Server Error` - Erro interno do servidor

## Modelo de Dados

### AspNetUser

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string | Identificador único do usuário (GUID) |
| userName | string | Nome de usuário (login) |
| email | string | Endereço de e-mail |
| nome | string | Nome completo do usuário |
| admissao | DateTime | Data de admissão do usuário |
| ativo | bool | Status do usuário (ativo/inativo) |
| funcao | string | Função/cargo do usuário |
| discriminator | string | Tipo de usuário (usado para autorização) |
| passwordHash | string | Hash da senha (não é retornado nas consultas padrão) |

## Observações Importantes

1. O campo `id` é gerado automaticamente pelo sistema se não for fornecido e é a chave primária da entidade.
2. O campo `userName` deve ser único no sistema.
3. O campo `ativo` indica se o usuário está ativo ou inativo no sistema.
4. O endpoint `DELETE` não remove fisicamente o usuário do banco de dados, apenas o marca como inativo.
5. Para restaurar um usuário desativado, utilize o endpoint `PATCH /api/AspNetUsers/activate/{id}`.
6. Todas as requisições a esta API requerem autenticação com token JWT.
