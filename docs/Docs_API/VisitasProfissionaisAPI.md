# Documentação da API de Profissionais de Visitas

Esta documentação descreve como utilizar a API de Profissionais de Visitas (Prescritores) no sistema SoftOne.

## Base URL

```
https://[seu-servidor]/api/VisitasProfissionais
```

## Endpoints Disponíveis

### 1. Listar Todos os Profissionais

**Endpoint:** `GET /api/VisitasProfissionais`

**Descrição:** Retorna uma lista de todos os profissionais cadastrados.

**Exemplo de Resposta:**
```json
[
  {
    "idProfissional": 1,
    "nomeProfissional": "Dr. João Silva",
    "sexoProfissional": "M",
    "dataNascimentoProfissional": "1980-05-15T00:00:00",
    "profissaoProfissional": "Médico",
    "especialidadeProfissional": "Cardiologia",
    "conselhoProfissional": "CRM",
    "numeroConselhoProfissional": "12345",
    "emailProfissional": "joao.silva@exemplo.com",
    "idPromotor": "1",
    "idConselho": 1,
    "idEstadoConselho": 1,
    "status": true
  },
  {
    "idProfissional": 2,
    "...": "..."
  }
]
```

### 2. Obter Profissional por ID

**Endpoint:** `GET /api/VisitasProfissionais/{id}`

**Descrição:** Retorna os detalhes de um profissional específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "idProfissional": 1,
  "nomeProfissional": "Dr. João Silva",
  "sexoProfissional": "M",
  "dataNascimentoProfissional": "1980-05-15T00:00:00",
  "profissaoProfissional": "Médico",
  "especialidadeProfissional": "Cardiologia",
  "conselhoProfissional": "CRM",
  "numeroConselhoProfissional": "12345",
  "emailProfissional": "joao.silva@exemplo.com",
  "idPromotor": "1",
  "idConselho": 1,
  "idEstadoConselho": 1,
  "status": true
}
```

### 3. Cadastrar Novo Profissional

**Endpoint:** `POST /api/VisitasProfissionais`

**Descrição:** Cria um novo registro de profissional.

**Payload:** O corpo da requisição deve conter os dados do profissional conforme o exemplo abaixo.

**Exemplo de Requisição:**
```json
{
  "nomeProfissional": "Dra. Maria Souza",
  "sexoProfissional": "F",
  "dataNascimentoProfissional": "1985-10-20",
  "profissaoProfissional": "Médica",
  "especialidadeProfissional": "Neurologia",
  "conselhoProfissional": "CRM",
  "numeroConselhoProfissional": "54321",
  "emailProfissional": "maria.souza@exemplo.com",
  "idPromotor": "2",
  "status": true
}
```

**Exemplo de Resposta:**
```json
{
  "idProfissional": 3,
  "nomeProfissional": "Dra. Maria Souza",
  "sexoProfissional": "F",
  "dataNascimentoProfissional": "1985-10-20T00:00:00",
  "profissaoProfissional": "Médica",
  "especialidadeProfissional": "Neurologia",
  "conselhoProfissional": "CRM",
  "numeroConselhoProfissional": "54321",
  "emailProfissional": "maria.souza@exemplo.com",
  "idPromotor": "2",
  "idConselho": null,
  "idEstadoConselho": null,
  "status": true
}
```

### 4. Atualizar Profissional

**Endpoint:** `PUT /api/VisitasProfissionais/{id}`

**Descrição:** Atualiza os dados de um profissional existente.

**Payload:** O corpo da requisição deve conter todos os dados do profissional, incluindo os que não foram alterados.

**Exemplo de Requisição:**
```json
{
  "idProfissional": 3,
  "nomeProfissional": "Dra. Maria Souza",
  "sexoProfissional": "F",
  "dataNascimentoProfissional": "1985-10-20",
  "profissaoProfissional": "Médica",
  "especialidadeProfissional": "Neurologia Clínica",
  "conselhoProfissional": "CRM",
  "numeroConselhoProfissional": "54321",
  "emailProfissional": "maria.souza.neuro@exemplo.com",
  "idPromotor": "2",
  "idConselho": 1,
  "idEstadoConselho": 1,
  "status": true
}
```

### 5. Excluir Profissional

**Endpoint:** `DELETE /api/VisitasProfissionais/{id}`

**Descrição:** Remove um profissional do sistema.

### 6. Atualizar Status do Profissional

**Endpoint:** `PATCH /api/VisitasProfissionais/status/{id}`

**Descrição:** Atualiza apenas o status de um profissional.

**Payload:** Um valor booleano que representa o novo status.

**Exemplo de Requisição:**
```json
false
```

### 7. Atualizar Promotor do Profissional

**Endpoint:** `PATCH /api/VisitasProfissionais/promotor/{id}`

**Descrição:** Atualiza apenas o ID do promotor associado ao profissional.

**Payload:** Uma string que representa o novo ID do promotor.

**Exemplo de Requisição:**
```json
"3"
```

**Alternativa:** Pode-se também usar o endpoint `PATCH /api/VisitasProfissionais/promotor/{id}/{idPromotor}` onde o ID do promotor é passado diretamente na URL.

## Códigos de Resposta

- `200 OK` - Requisição processada com sucesso
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request` - Erro na requisição 
- `404 Not Found` - Recurso não encontrado
- `500 Internal Server Error` - Erro interno do servidor

## Tratamento de Erros

Em caso de erro, a API retornará um objeto JSON com informações sobre o erro:

```json
{
  "mensagem": "Ocorreu um erro ao processar sua solicitação",
  "detalhe": "Descrição detalhada do erro",
  "innerMessage": "Mensagem de erro interna (quando disponível)"
}
```

## Observações Importantes

1. O campo `idProfissional` é gerado automaticamente pelo sistema e é a chave primária da entidade.
2. O campo `status` é opcional no cadastro. Se não for informado, será definido como `true`.
3. Os campos `idConselho` e `idEstadoConselho` são opcionais no cadastro e podem ser deixados como `null`.
4. A data de nascimento deve ser informada no formato ISO 8601 (YYYY-MM-DD).
5. Todos os endpoints retornam dados no formato JSON. 