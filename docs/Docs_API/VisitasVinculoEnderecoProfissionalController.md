# Documentação: VisitasVinculoEnderecoProfissional API

Esta API gerencia os vínculos entre endereços e profissionais no sistema.

## Autenticação

**Importante**: Todas as rotas desta API requerem autenticação.

Para acessar qualquer endpoint, é necessário incluir o token JWT no cabeçalho da requisição:

```
Authorization: Bearer {seu-token-jwt}
```

## Endpoints Disponíveis

### 1. Obter todos os vínculos

Retorna todos os vínculos entre endereços e profissionais cadastrados no sistema.

- **URL**: `/api/VisitasVinculoEnderecoProfissional`
- **Método**: `GET`
- **Autenticação**: Obrigatória
- **Retorno**: Lista de objetos VisitasVinculoEnderecoProfissional

**Exemplo de resposta**:
```json
[
  {
    "id": 1,
    "idProfissional": 123,
    "idOrigemDestinoOrigemDestino": 456,
    "idUsuario": "usuario1"
  },
  {
    "id": 2,
    "idProfissional": 789,
    "idOrigemDestinoOrigemDestino": 101,
    "idUsuario": "usuario2"
  }
]
```

### 2. Obter vínculo por ID

Retorna um vínculo específico baseado no ID.

- **URL**: `/api/VisitasVinculoEnderecoProfissional/{id}`
- **Método**: `GET`
- **Parâmetros**:
  - `id` (na URL): ID do vínculo a ser obtido
- **Autenticação**: Obrigatória
- **Retorno**: Objeto VisitasVinculoEnderecoProfissional ou NotFound (404) se não existir

**Exemplo de resposta**:
```json
{
  "id": 1,
  "idProfissional": 123,
  "idOrigemDestinoOrigemDestino": 456,
  "idUsuario": "usuario1"
}
```

### 3. Obter vínculos por profissional

Retorna todos os vínculos associados a um profissional específico.

- **URL**: `/api/VisitasVinculoEnderecoProfissional/profissional/{idProfissional}`
- **Método**: `GET`
- **Parâmetros**:
  - `idProfissional` (na URL): ID do profissional
- **Autenticação**: Obrigatória
- **Retorno**: Lista de objetos VisitasVinculoEnderecoProfissional ou lista vazia se não existirem

**Exemplo de resposta**:
```json
[
  {
    "id": 1,
    "idProfissional": 123,
    "idOrigemDestinoOrigemDestino": 456,
    "idUsuario": "usuario1"
  },
  {
    "id": 3,
    "idProfissional": 123,
    "idOrigemDestinoOrigemDestino": 789,
    "idUsuario": "usuario3"
  }
]
```

### 4. Obter vínculos por origem/destino

Retorna todos os vínculos associados a uma origem/destino específica.

- **URL**: `/api/VisitasVinculoEnderecoProfissional/origemdestino/{idOrigemDestino}`
- **Método**: `GET`
- **Parâmetros**:
  - `idOrigemDestino` (na URL): ID da origem/destino
- **Autenticação**: Obrigatória
- **Retorno**: Lista de objetos VisitasVinculoEnderecoProfissional ou lista vazia se não existirem

**Exemplo de resposta**:
```json
[
  {
    "id": 1,
    "idProfissional": 123,
    "idOrigemDestinoOrigemDestino": 456,
    "idUsuario": "usuario1"
  },
  {
    "id": 5,
    "idProfissional": 333,
    "idOrigemDestinoOrigemDestino": 456,
    "idUsuario": "usuario5"
  }
]
```

### 5. Criar um novo vínculo

Cria um novo vínculo entre um profissional e um endereço.

- **URL**: `/api/VisitasVinculoEnderecoProfissional`
- **Método**: `POST`
- **Dados**: Você pode usar qualquer um dos dois formatos abaixo:

**Formato 1 (Recomendado - Simplificado)**:
```json
{
  "idProfissional": 123,
  "idLocal": 456,
  "idUsuario": "usuario1"
}
```

**Formato 2 (Nome de campo completo)**:
```json
{
  "idProfissional": 123,
  "idOrigemDestinoOrigemDestino": 456,
  "idUsuario": "usuario1"
}
```

- **Campos obrigatórios**:
  - `idProfissional`: ID do profissional
  - E um dos seguintes (apenas um deles):
    - `idLocal`: ID da origem/destino (formato simplificado)
    - `idOrigemDestinoOrigemDestino`: ID da origem/destino (formato completo)
- **Campos opcionais**:
  - `idUsuario`: ID do usuário que está criando o vínculo
- **Autenticação**: Obrigatória
- **Retorno**: Objeto VisitasVinculoEnderecoProfissional criado com ID gerado

**Exemplo de resposta**:
```json
{
  "id": 10,
  "idProfissional": 123,
  "idOrigemDestinoOrigemDestino": 456,
  "idUsuario": "usuario1"
}
```

### 6. Atualizar um vínculo existente

Atualiza os dados de um vínculo existente.

- **URL**: `/api/VisitasVinculoEnderecoProfissional/{id}`
- **Método**: `PUT`
- **Parâmetros**:
  - `id` (na URL): ID do vínculo a ser atualizado
- **Dados**:
  ```json
  {
    "idProfissional": 789,
    "idOrigemDestinoOrigemDestino": 101,
    "idUsuario": "usuarioNovo"
  }
  ```
- **Campos obrigatórios**:
  - `idProfissional`: ID do profissional
  - `idOrigemDestinoOrigemDestino`: ID da origem/destino
- **Campos opcionais**:
  - `idUsuario`: ID do usuário que está atualizando o vínculo
- **Autenticação**: Obrigatória
- **Retorno**: NoContent (204) se sucesso ou NotFound (404) se não existir

### 7. Remover um vínculo

Remove um vínculo existente.

- **URL**: `/api/VisitasVinculoEnderecoProfissional/{id}`
- **Método**: `DELETE`
- **Parâmetros**:
  - `id` (na URL): ID do vínculo a ser removido
- **Autenticação**: Obrigatória
- **Retorno**: NoContent (204) se sucesso ou NotFound (404) se não existir

## Modelo de Dados

### VisitasVinculoEnderecoProfissional

| Campo                       | Tipo    | Descrição                                |
|----------------------------|---------|------------------------------------------|
| id                         | int     | Identificador único do vínculo           |
| idProfissional             | int     | ID do profissional vinculado             |
| idOrigemDestinoOrigemDestino | int     | ID da origem/destino vinculada           |
| idUsuario                  | string  | ID do usuário que criou/atualizou o vínculo (opcional) |

## Erros Comuns

- **401 Unauthorized**: Token de autenticação ausente, inválido ou expirado
- **404 Not Found**: Vínculo não encontrado com o ID especificado
- **400 Bad Request**: Dados inválidos ou campos obrigatórios ausentes
- **500 Internal Server Error**: Erro interno no servidor (detalhes no corpo da resposta)

## Exemplos de Uso

### Exemplo com cURL (criação com formato simplificado)

```bash
curl -X POST "http://192.168.194.62:5000/api/VisitasVinculoEnderecoProfissional" \
     -H "Authorization: Bearer seu-token" \
     -H "Content-Type: application/json" \
     -d '{
           "idProfissional": 123,
           "idLocal": 456,
           "idUsuario": "usuario1"
         }'
```

### Exemplo com JavaScript (criação com formato simplificado)

```javascript
fetch('http://192.168.194.62:5000/api/VisitasVinculoEnderecoProfissional', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer seu-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    idProfissional: 123,
    idLocal: 456,
    idUsuario: 'usuario1'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro:', error));
```