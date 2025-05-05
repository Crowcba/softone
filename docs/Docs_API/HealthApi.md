# Documentação do Health Check API

## Descrição

O endpoint Health Check fornece informações sobre o status e saúde da API SoftOne. Este endpoint é útil para monitoramento, alertas e diagnóstico da aplicação.

## Endpoint

```
GET /api/health
```

## Autenticação

Este endpoint não requer autenticação para facilitar o monitoramento externo.

## Resposta

### Status 200 OK

Quando a API está funcionando corretamente:

```json
{
  "status": "online",
  "version": "1.0.0.0",
  "environment": "Production",
  "timestamp": "2023-07-20T15:30:45.123Z",
  "uptime": "10d 5h 30m 15s",
  "database": {
    "status": "connected",
    "provider": "Microsoft.EntityFrameworkCore.SqlServer"
  },
  "memory": {
    "usage": "156.25 MB"
  }
}
```

### Propriedades da Resposta

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| status | string | Status atual da API ("online" ou "error") |
| version | string | Versão atual da aplicação |
| environment | string | Ambiente onde a API está rodando (Development, Staging, Production) |
| timestamp | datetime | Data e hora UTC da verificação |
| uptime | string | Tempo de atividade contínua da API desde o último reinício |
| database.status | string | Status da conexão com o banco de dados ("connected" ou "disconnected") |
| database.provider | string | Provedor do banco de dados utilizado |
| memory.usage | string | Quantidade de memória utilizada pela aplicação |

### Status 500 Internal Server Error

Quando ocorre um erro ao verificar o status:

```json
{
  "status": "error",
  "message": "Falha ao verificar o status da API",
  "timestamp": "2023-07-20T15:30:45.123Z"
}
```

## Uso em Monitoramento

Este endpoint pode ser utilizado para:

1. **Monitoramento de disponibilidade**: Verificação periódica para garantir que a API está no ar
2. **Alertas**: Configuração de alertas quando o status não é "online" ou quando o banco de dados está desconectado
3. **Métricas**: Coleta de informações como uso de memória e tempo de atividade para análise de desempenho
4. **Diagnóstico**: Identificação rápida de problemas com o banco de dados ou outros componentes

## Exemplo de Chamada

### cURL

```bash
curl -X GET https://sua-api.exemplo.com/api/health
```

### PowerShell

```powershell
Invoke-RestMethod -Uri "https://sua-api.exemplo.com/api/health" -Method Get
```
