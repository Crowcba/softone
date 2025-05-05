export interface ProdutoResumido {
  idProduto: number;
  nomeProduto: string;
  codigoAn: string;
  codigoBarrasProduto: string;
  precoVendaProduto: number;
  ativoProduto: string;
  idGrupo: number;
  idMarca: number;
  estoqueMinimoProduto: number;
  dataCadastro: string;
}

export interface ProdutoSimplificado {
  idProduto: number;
  nomeProduto: string;
}

export interface ProdutoDetalhado {
  idProduto: number;
  cadastroFornecedorId: number;
  nomeFornecedor: string;
  codigoAn: string;
  idGrupo: number;
  idConfiguracaoFiscal: number;
  nomeProduto: string;
  complementoProduto: string;
  descricaoTecnicaProduto: string;
  observacaoCadastroProduto: string;
  ativoProduto: string;
  codigoBarrasProduto: string;
  codigoBarrasProdutoCaixa?: string;
  codigoNcmProduto: string;
  unidadeFornecimentoProduto: string;
  quantidadeEmbalagemProduto: number;
  unidadeMovimentacaoProduto: string;
  quantidadeMovimentacaoProduto: number;
  controleLoteProduto: string;
  estoqueMinimoProduto: number;
  pesoProduto?: number;
  precoVendaSugerido: number;
  precoVendaProduto: number;
  precoCompraProduto: number;
  tipoProduto: string;
  idMarca: number;
  dataCadastro: string;
  idUsuarioQuemCadastrou?: string;
}

export interface ProdutoCriar {
  cadastroFornecedorId: number;
  codigoAn: string;
  idGrupo: number;
  idConfiguracaoFiscal: number;
  nomeProduto: string;
  complementoProduto?: string;
  descricaoTecnicaProduto?: string;
  observacaoCadastroProduto?: string;
  ativoProduto: string;
  codigoBarrasProduto: string;
  codigoBarrasProdutoCaixa?: string;
  codigoNcmProduto: string;
  unidadeFornecimentoProduto: string;
  quantidadeEmbalagemProduto: number;
  unidadeMovimentacaoProduto: string;
  quantidadeMovimentacaoProduto: number;
  controleLoteProduto: string;
  estoqueMinimoProduto: number;
  pesoProduto?: number;
  precoVendaSugerido?: number;
  precoVendaProduto: number;
  precoCompraProduto: number;
  tipoProduto: string;
  idMarca: number;
}

export interface ProdutoAtualizar extends ProdutoCriar {
  idProduto: number;
}

export interface ProdutosPaginados {
  itens: ProdutoResumido[];
  paginaAtual: number;
  totalPaginas: number;
  itensPorPagina: number;
  totalItens: number;
}

