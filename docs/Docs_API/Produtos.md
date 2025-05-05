# Documentação da API de Produtos

Esta documentação descreve como usar os endpoints da API de Produtos, incluindo exemplos de requisições e respostas.

## Visão Geral

A API de Produtos oferece funcionalidades para gerenciar os produtos do sistema SoftOne, permitindo listar, criar, atualizar e excluir produtos. Todos os endpoints requerem autenticação via token JWT.

## Endpoints

### Listar Produtos (Paginado)

**Endpoint:** `GET /api/Produto`

**Descrição:** Retorna uma lista paginada de produtos com informações resumidas.

**Parâmetros de consulta:**
- `termo` (opcional): Termo de busca para filtrar produtos por nome, código ou código de barras
- `idFornecedor` (opcional): Filtrar por ID do fornecedor
- `idGrupo` (opcional): Filtrar por ID do grupo
- `idMarca` (opcional): Filtrar por ID da marca
- `ativo` (opcional): Filtrar por status ("S" para ativos, "N" para inativos)
- `pagina` (opcional, padrão: 1): Número da página desejada
- `itensPorPagina` (opcional, padrão: 20, máximo: 100): Quantidade de itens por página
- `ordenarPor` (opcional, padrão: "NomeProduto"): Campo para ordenação
- `ascendente` (opcional, padrão: true): true para ordenação ascendente, false para descendente

**Exemplo de Requisição:**
```
GET /api/Produto?termo=medicamento&idFornecedor=5&pagina=1&itensPorPagina=20&ordenarPor=DataCadastro&ascendente=false
```

**Exemplo de Resposta bem-sucedida (200 OK):**
```json
{
  "itens": [
    {
      "idProduto": 123,
      "nomeProduto": "Medicamento ABC",
      "codigoAn": "MED123",
      "codigoBarrasProduto": "7891234567890",
      "precoVendaProduto": 25.90,
      "ativoProduto": "S",
      "idGrupo": 2,
      "idMarca": 5,
      "estoqueMinimoProduto": 10,
      "dataCadastro": "2023-04-15T10:30:00"
    },
    // ... mais produtos
  ],
  "paginaAtual": 1,
  "totalPaginas": 5,
  "itensPorPagina": 20,
  "totalItens": 98
}
```

### Listar Produtos Simplificado

**Endpoint:** `GET /api/Produto/lista-simples`

**Descrição:** Retorna uma lista simplificada de todos os produtos ativos, contendo apenas ID e nome. Útil para preenchimento de dropdowns e seletores em interfaces.

**Exemplo de Requisição:**
```
GET /api/Produto/lista-simples
```

**Exemplo de Resposta bem-sucedida (200 OK):**
```json
[
  {
    "idProduto": 123,
    "nomeProduto": "Medicamento ABC"
  },
  {
    "idProduto": 124,
    "nomeProduto": "Medicamento XYZ"
  },
  {
    "idProduto": 125,
    "nomeProduto": "Vitamina D3"
  }
  // ... mais produtos
]
```

### Obter Produto por ID

**Endpoint:** `GET /api/Produto/{id}`

**Descrição:** Retorna informações detalhadas de um produto específico.

**Parâmetros de Path:**
- `id`: ID do produto a ser consultado

**Exemplo de Requisição:**
```
GET /api/Produto/123
```

**Exemplo de Resposta bem-sucedida (200 OK):**
```json
{
  "idProduto": 123,
  "cadastroFornecedorId": 5,
  "nomeFornecedor": "Distribuidora Médica Ltda",
  "codigoAn": "MED123",
  "idGrupo": 2,
  "idConfiguracaoFiscal": 3,
  "nomeProduto": "Medicamento ABC",
  "complementoProduto": "100mg - 20 comprimidos",
  "descricaoTecnicaProduto": "Medicamento para tratamento...",
  "observacaoCadastroProduto": "Venda sob prescrição médica",
  "ativoProduto": "S",
  "codigoBarrasProduto": "7891234567890",
  "codigoBarrasProdutoCaixa": "17891234567897",
  "codigoNcmProduto": "3004.90.19",
  "unidadeFornecimentoProduto": "CX",
  "quantidadeEmbalagemProduto": 20,
  "unidadeMovimentacaoProduto": "UN",
  "quantidadeMovimentacaoProduto": 1,
  "controleLoteProduto": "S",
  "estoqueMinimoProduto": 10,
  "pesoProduto": 0.1,
  "precoVendaSugerido": 29.90,
  "precoVendaProduto": 25.90,
  "precoCompraProduto": 15.50,
  "tipoProduto": "M",
  "idMarca": 5,
  "dataCadastro": "2023-04-15T10:30:00",
  "idUsuarioQuemCadastrou": "admin@softone.com"
}
```

### Criar Produto

**Endpoint:** `POST /api/Produto`

**Descrição:** Cria um novo produto no sistema.

**Corpo da Requisição:** Objeto JSON contendo os dados do produto a ser criado.

**Exemplo de Requisição:**
```json
{
  "cadastroFornecedorId": 5,
  "codigoAn": "MED456",
  "idGrupo": 2,
  "idConfiguracaoFiscal": 3,
  "nomeProduto": "Medicamento XYZ",
  "complementoProduto": "50mg - 30 comprimidos",
  "descricaoTecnicaProduto": "Medicamento para tratamento...",
  "observacaoCadastroProduto": "Venda sob prescrição médica",
  "ativoProduto": "S",
  "codigoBarrasProduto": "7891234567891",
  "codigoNcmProduto": "3004.90.19",
  "unidadeFornecimentoProduto": "CX",
  "quantidadeEmbalagemProduto": 30,
  "unidadeMovimentacaoProduto": "UN",
  "quantidadeMovimentacaoProduto": 1,
  "controleLoteProduto": "S",
  "estoqueMinimoProduto": 15,
  "precoVendaSugerido": 39.90,
  "precoVendaProduto": 34.90,
  "precoCompraProduto": 20.50,
  "tipoProduto": "M",
  "idMarca": 5
}
```

**Exemplo de Resposta bem-sucedida (201 Created):**
O produto criado com o ID atribuído é retornado no corpo da resposta.

### Atualizar Produto

**Endpoint:** `PUT /api/Produto/{id}`

**Descrição:** Atualiza um produto existente.

**Parâmetros de Path:**
- `id`: ID do produto a ser atualizado

**Corpo da Requisição:** Objeto JSON contendo os dados atualizados do produto.

**Exemplo de Requisição:**
```json
{
  "idProduto": 123,
  "cadastroFornecedorId": 5,
  "codigoAn": "MED123",
  "idGrupo": 2,
  "idConfiguracaoFiscal": 3,
  "nomeProduto": "Medicamento ABC - Nova Fórmula",
  "complementoProduto": "100mg - 20 comprimidos",
  "descricaoTecnicaProduto": "Medicamento para tratamento...",
  "observacaoCadastroProduto": "Venda sob prescrição médica",
  "ativoProduto": "S",
  "codigoBarrasProduto": "7891234567890",
  "codigoBarrasProdutoCaixa": "17891234567897",
  "codigoNcmProduto": "3004.90.19",
  "unidadeFornecimentoProduto": "CX",
  "quantidadeEmbalagemProduto": 20,
  "unidadeMovimentacaoProduto": "UN",
  "quantidadeMovimentacaoProduto": 1,
  "controleLoteProduto": "S",
  "estoqueMinimoProduto": 10,
  "pesoProduto": 0.1,
  "precoVendaSugerido": 32.90,
  "precoVendaProduto": 29.90,
  "precoCompraProduto": 18.50,
  "tipoProduto": "M",
  "idMarca": 5
}
```

**Exemplo de Resposta bem-sucedida (204 No Content):**
Em caso de sucesso, o servidor retorna status 204 sem corpo de resposta.

### Excluir Produto

**Endpoint:** `DELETE /api/Produto/{id}`

**Descrição:** Exclui um produto existente. Apenas usuários com função de Admin podem usar este endpoint. Produtos com movimentações relacionadas não podem ser excluídos.

**Parâmetros de Path:**
- `id`: ID do produto a ser excluído

**Exemplo de Requisição:**
```
DELETE /api/Produto/123
```

**Exemplo de Resposta bem-sucedida (204 No Content):**
Em caso de sucesso, o servidor retorna status 204 sem corpo de resposta.

## Filtros e Paginação

A API suporta filtros e paginação para facilitar a busca e visualização de produtos. Os principais parâmetros são:

1. **Termo de busca**: Filtra por nome, código ou código de barras.
2. **Filtros específicos**: Por fornecedor, grupo, marca ou status ativo.
3. **Paginação**: Permite definir a página e quantidade de itens por página.
4. **Ordenação**: Permite ordenar por qualquer campo e escolher a direção da ordenação.

Exemplo de uso combinado:
```
GET /api/Produto?termo=medicamento&idFornecedor=5&pagina=2&itensPorPagina=50&ordenarPor=PrecoVendaProduto&ascendente=false
```

Este exemplo retorna a segunda página de produtos que contêm "medicamento" no nome, código ou código de barras, do fornecedor com ID 5, ordenados por preço de venda em ordem decrescente, com 50 itens por página.

## Códigos de Status

- **200 OK**: Requisição bem-sucedida (para GET)
- **201 Created**: Recurso criado com sucesso (para POST)
- **204 No Content**: Requisição bem-sucedida sem conteúdo a retornar (para PUT e DELETE)
- **400 Bad Request**: Dados inválidos ou incompatíveis
- **401 Unauthorized**: Token de autenticação ausente ou inválido
- **403 Forbidden**: Token válido, mas sem permissão para o recurso solicitado
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor 