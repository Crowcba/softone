import { ProdutoResumido, ProdutoDetalhado, ProdutoCriar, ProdutoAtualizar, ProdutosPaginados, ProdutoSimplificado } from "../../api/sales/products";
import { api } from "../../config/api";

class ProductsService {
    // Cache para produtos simplificados
    private simplifiedProductsCache: ProdutoSimplificado[] | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos
    
    async getProducts(
        termo?: string, 
        idFornecedor?: number, 
        idGrupo?: number, 
        idMarca?: number, 
        ativo?: string, 
        pagina: number = 1, 
        itensPorPagina: number = 20, 
        ordenarPor: string = "NomeProduto", 
        ascendente: boolean = true
    ): Promise<ProdutosPaginados> {
        try {
            let params = new URLSearchParams();
            if (termo) params.append('termo', termo);
            if (idFornecedor) params.append('idFornecedor', idFornecedor.toString());
            if (idGrupo) params.append('idGrupo', idGrupo.toString());
            if (idMarca) params.append('idMarca', idMarca.toString());
            if (ativo) params.append('ativo', ativo);
            params.append('pagina', pagina.toString());
            params.append('itensPorPagina', itensPorPagina.toString());
            params.append('ordenarPor', ordenarPor);
            params.append('ascendente', ascendente.toString());

            const response = await api.get(`/api/Produto?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }

    async getProductById(id: number): Promise<ProdutoDetalhado> {
        try {
            const response = await api.get(`/api/Produto/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar produto por ID:', error);
            throw error;
        }
    }

    async createProduct(produto: ProdutoCriar): Promise<ProdutoDetalhado> {
        try {
            const response = await api.post('/api/Produto', produto);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    }

    async updateProduct(id: number, produto: ProdutoAtualizar): Promise<void> {
        try {
            await api.put(`/api/Produto/${id}`, produto);
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    }

    async deleteProduct(id: number): Promise<void> {
        try {
            await api.delete(`/api/Produto/${id}`);
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            throw error;
        }
    }

    async getSimplifiedProducts(): Promise<ProdutoSimplificado[]> {
        // Verificar se temos cache válido
        const now = Date.now();
        if (this.simplifiedProductsCache && (now - this.cacheTimestamp < this.CACHE_DURATION_MS)) {
            console.log('Usando cache de produtos simplificados');
            return this.simplifiedProductsCache;
        }
        
        try {
            try {
                // Tenta usar o novo endpoint
                console.log('Buscando produtos simplificados via endpoint lista-simples');
                const response = await api.get('/api/Produto/lista-simples');
                this.simplifiedProductsCache = response.data;
                this.cacheTimestamp = now;
                return response.data;
            } catch (error: any) {
                console.error('Erro ao buscar lista simplificada de produtos:', error);
                
                // Se o erro for 404 (endpoint não encontrado), usa o método alternativo
                if (error.response && error.response.status === 404) {
                    console.log('Endpoint lista-simples não encontrado, usando método alternativo');
                    
                    // Buscar produtos normalmente e converter para o formato simplificado
                    console.log('Buscando produtos via método padrão para mapear para formato simplificado');
                    const produtosPaginados = await this.getProducts('', undefined, undefined, undefined, 'S', 1, 100);
                    
                    // Mapear apenas os campos necessários
                    const simplifiedProducts = produtosPaginados.itens.map(produto => ({
                        idProduto: produto.idProduto,
                        nomeProduto: produto.nomeProduto
                    }));
                    
                    // Atualizar cache
                    this.simplifiedProductsCache = simplifiedProducts;
                    this.cacheTimestamp = now;
                    
                    return simplifiedProducts;
                }
                
                // Se for outro tipo de erro, propaga o erro
                throw error;
            }
        } catch (error) {
            console.error('Erro ao buscar lista simplificada de produtos:', error);
            // Retorna array vazio em caso de erro para não quebrar a aplicação
            return [];
        }
    }
    
    // Método para limpar o cache manualmente
    clearSimplifiedProductsCache() {
        this.simplifiedProductsCache = null;
        this.cacheTimestamp = 0;
        console.log('Cache de produtos simplificados limpo');
    }
}

let service: ProductsService;

export async function getProductsService(): Promise<ProductsService> {
    if (!service) {
        service = new ProductsService();
    }
    return service;
}

