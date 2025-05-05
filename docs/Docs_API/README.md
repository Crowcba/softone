# Documentação da API SoftOne

Bem-vindo à documentação completa da API SoftOne. Esta documentação fornece todas as informações necessárias para utilizar e integrar com a API do sistema SoftOne.

## Índice de Documentos

### Documentação Geral

- [Autenticação](Autenticacao.md): Explica como autenticar-se na API e obter tokens JWT
- [Exemplos de Consultas](Exemplo_Consultas.md): Exemplos práticos de consultas à API em diferentes linguagens
- [SQL Índices](SQL_Indices.md): Scripts SQL para otimizar o desempenho do banco de dados
- [Health Check API](HealthApi.md): Documentação do endpoint de verificação de saúde da API
- [Melhorias de Segurança](MelhoriasSeguranca.md): Recomendações para fortalecer a segurança da API

### APIs de Administração do Sistema

- [API de Módulos](CadastroModulos.md): Documentação da API para gerenciar módulos do sistema
- [API de Permissões](CadastroPermissao.md): Como gerenciar permissões de acesso dos usuários aos módulos
- [API de Vínculos entre Usuários e Empresas](CadastroAspnetusersEmpresas.md): Gerenciamento de associações entre usuários e empresas

### APIs de Profissionais e Visitas

- [API de Profissionais](VisitasProfissionaisAPI.md): Documentação completa da API de Profissionais de Visitas
- [API de Telefones de Profissionais](VisitasProfissionalTelefone.md): Como gerenciar os telefones associados aos profissionais
- [API de Origem e Destino de Visitas](VisitasOrigemDestino.md): Gerenciamento de locais de origem e destino para visitas

## Visão Geral da API

A API SoftOne segue os princípios REST e utiliza o formato JSON para comunicação. Todas as requisições à API devem ser autenticadas usando tokens JWT, exceto pelo endpoint de login.

### Autenticação

Para utilizar a API, você precisa obter um token JWT através do endpoint de login:

```
POST /api/Auth/login
```

Para mais detalhes sobre autenticação, consulte a [documentação de autenticação](Autenticacao.md).

### Formatos de Requisição e Resposta

- Todas as requisições e respostas usam o formato JSON
- Os timestamps são formatados no padrão ISO 8601 (YYYY-MM-DDTHH:MM:SS)
- As respostas de erro seguem um formato padrão com mensagens descritivas

### Códigos de Status HTTP

A API utiliza códigos HTTP padrão:

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `204 No Content`: Requisição processada com sucesso, sem conteúdo para retornar
- `400 Bad Request`: Erro na requisição
- `401 Unauthorized`: Falha na autenticação
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro interno do servidor

## Resumo dos Endpoints

### Autenticação e Segurança

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/Auth/login` | POST | Realiza autenticação e retorna token JWT |
| `/api/Auth/refresh-token` | POST | Renova um token JWT existente |
| `/api/health` | GET | Verifica status e saúde da API (não requer autenticação) |

### Administração do Sistema

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/CadastroModulos` | GET | Lista todos os módulos do sistema |
| `/api/CadastroModulos/{id}` | GET | Obtém detalhes de um módulo específico |
| `/api/CadastroPermissao` | GET | Lista todas as permissões de acesso |
| `/api/CadastroPermissao/{usuarioId}/{moduloId}` | GET | Verifica permissão de um usuário para um módulo |
| `/api/CadastroAspnetusersEmpresas/usuario/{usuarioId}` | GET | Lista empresas vinculadas a um usuário |

### Profissionais e Visitas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/VisitasProfissional` | GET | Lista todos os profissionais |
| `/api/VisitasProfissional/{id}` | GET | Obtém detalhes de um profissional específico |
| `/api/VisitasProfissional/busca` | POST | Busca profissionais com filtros complexos |
| `/api/VisitasProfissionalTelefone` | GET | Lista todos os telefones de profissionais |
| `/api/VisitasProfissionalTelefone/{id}` | GET | Obtém um telefone específico |
| `/api/VisitasProfissionalTelefone` | POST | Cria um novo registro de telefone |
| `/api/VisitasProfissionalTelefone/{id}` | PUT | Atualiza um telefone existente |
| `/api/VisitasProfissionalTelefone/{id}` | DELETE | Remove um telefone |
| `/api/VisitasProfissionalTelefone/principal/{id}` | PATCH | Define telefone como principal |
| `/api/VisitasProfissionalTelefone/whatsapp/{id}` | PATCH | Define telefone como whatsapp |
| `/api/VisitasProfissionalTelefone/profissional/{idProfissional}` | GET | Lista telefones de um profissional |
| `/api/VisitasOrigemDestino` | GET | Lista origens e destinos de visitas |
| `/api/VisitasOrigemDestino/{id}` | GET | Obtém detalhes de origem/destino específico |

Para informações detalhadas sobre cada endpoint, consulte a documentação específica de cada API listada no índice.

## Recomendações de Segurança

1. Sempre utilize HTTPS para todas as requisições à API.
2. Mantenha seu token JWT seguro e não o exponha em código-fonte público.
3. Armazene tokens JWT no lado do cliente em locais seguros como HttpOnly cookies.
4. Implemente timeout adequado para requisições HTTP para evitar bloqueios prolongados.

## Suporte

Se você encontrar problemas ou tiver dúvidas sobre a API, entre em contato com nossa equipe de suporte através do email suporte@softone.com.br.

## Atualizações da Documentação

Esta documentação é atualizada regularmente para refletir as mudanças e melhorias na API. Verifique regularmente para ter acesso às informações mais recentes.