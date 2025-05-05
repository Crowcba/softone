# Documentação da API de Vínculos entre Usuários e Empresas

Esta documentação descreve como utilizar a API de Vínculos entre Usuários e Empresas no sistema SoftOne, que permite gerenciar as associações entre usuários e empresas.

## Base URL

```
https://[seu-servidor]/api/CadastroAspnetusersEmpresas
```

## Endpoints Disponíveis

### 1. Listar Todos os Vínculos

**Endpoint:** `GET /api/CadastroAspnetusersEmpresas`

**Descrição:** Retorna uma lista de todos os vínculos entre usuários e empresas cadastrados no sistema.

**Exemplo de Resposta:**
```json
[
  {
    "idAspnetusersEmpresa": 1,
    "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "idEmpresa": 1
  },
  {
    "idAspnetusersEmpresa": 2,
    "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "idEmpresa": 2
  }
]
```

### 2. Listar Empresas por Nome de Usuário

**Endpoint:** `GET /api/CadastroAspnetusersEmpresas/ByUserName/{userName}`

**Descrição:** Retorna uma lista de empresas associadas a um usuário específico, buscando pelo nome de usuário. Este endpoint une tabelas para retornar informações mais detalhadas da empresa.

**Exemplo de Resposta:**
```json
[
  {
    "idEmpresa": 1,
    "fantasiaEmpresa": "Empresa A"
  },
  {
    "idEmpresa": 2,
    "fantasiaEmpresa": "Empresa B"
  }
]
```

**Códigos de Resposta Específicos:**
- `404 Not Found` - Retornado quando o usuário não existe ou quando não há empresas vinculadas ao usuário
- `500 Internal Server Error` - Detalha o erro ocorrido durante a execução

### 3. Obter Vínculo por ID

**Endpoint:** `GET /api/CadastroAspnetusersEmpresas/{id}`

**Descrição:** Retorna os detalhes de um vínculo específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "idAspnetusersEmpresa": 1,
  "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idEmpresa": 1
}
```

**Códigos de Resposta Específicos:**
- `404 Not Found` - Retornado com uma mensagem "Empresa não encontrada"

### 4. Listar Vínculos por ID do Usuário

**Endpoint:** `GET /api/CadastroAspnetusersEmpresas/user/{userId}`

**Descrição:** Retorna todos os vínculos associados a um usuário específico, buscando pelo ID do usuário.

**Exemplo de Resposta:**
```json
[
  {
    "idAspnetusersEmpresa": 1,
    "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "idEmpresa": 1
  },
  {
    "idAspnetusersEmpresa": 2,
    "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
    "idEmpresa": 2
  }
]
```

**Códigos de Resposta Específicos:**
- `404 Not Found` - Retornado com uma mensagem "Nenhuma empresa encontrada para o usuário"

### 5. Criar Novo Vínculo

**Endpoint:** `POST /api/CadastroAspnetusersEmpresas`

**Descrição:** Cria um novo vínculo entre um usuário e uma empresa.

**Payload:** O corpo da requisição deve conter os dados do vínculo conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idEmpresa": 3
}
```

**Exemplo de Resposta:**
```json
{
  "idAspnetusersEmpresa": 3,
  "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idEmpresa": 3
}
```

### 6. Atualizar Vínculo

**Endpoint:** `PUT /api/CadastroAspnetusersEmpresas/{id}`

**Descrição:** Atualiza os dados de um vínculo existente.

**Payload:** O corpo da requisição deve conter todos os dados do vínculo, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "idAspnetusersEmpresa": 3,
  "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
  "idEmpresa": 4
}
```

**Códigos de Resposta Específicos:**
- `400 Bad Request` - Retornado quando o ID na URL não corresponde ao ID no corpo da requisição

### 7. Excluir Vínculo

**Endpoint:** `DELETE /api/CadastroAspnetusersEmpresas/{id}`

**Descrição:** Remove um vínculo entre usuário e empresa do sistema.

**Códigos de Resposta Específicos:**
- `404 Not Found` - Retornado com uma mensagem "Empresa não encontrada"

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Exemplo de Uso com cURL

### Listar empresas associadas a um usuário

```bash
curl -X GET "https://seu-servidor/api/CadastroAspnetusersEmpresas/ByUserName/usuario.teste" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json"
```

### Cadastrar um novo vínculo

```bash
curl -X POST "https://seu-servidor/api/CadastroAspnetusersEmpresas" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idAspnetusers": "8e445865-a24d-4543-a6c6-9443d048cdb9",
           "idEmpresa": 5
         }'
```

## Exemplo de Uso com JavaScript (Fetch API)

```javascript
// Listar empresas por nome de usuário
fetch('https://seu-servidor/api/CadastroAspnetusersEmpresas/ByUserName/usuario.teste', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (!response.ok) {
    if (response.status === 404) {
      return response.json().then(error => Promise.reject(`Não encontrado: ${error.message}`));
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));

// Criar novo vínculo
const novoVinculo = {
  idAspnetusers: "8e445865-a24d-4543-a6c6-9443d048cdb9",
  idEmpresa: 6
};

fetch('https://seu-servidor/api/CadastroAspnetusersEmpresas', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoVinculo)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```

## Observações Importantes

1. O campo `idAspnetusersEmpresa` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `idAspnetusers` é obrigatório e deve referenciar um usuário existente na tabela de usuários.
3. O campo `idEmpresa` é obrigatório e deve referenciar uma empresa existente na tabela de empresas.
4. A API não permite a criação de vínculos duplicados entre o mesmo usuário e empresa.
5. Todas as requisições a esta API requerem autenticação com token JWT.
6. O controlador implementa logging detalhado, então erros mais específicos podem ser verificados nos logs do servidor.