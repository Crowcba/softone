/**
 * Lida com os erros retornados pela API, extraindo uma mensagem amigável.
 *
 * @param error - Objeto de erro capturado.
 * @returns Um erro com uma mensagem adequada.
 */
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function handleApiError(error: ApiErrorResponse): Error {
  // Se a resposta da API contiver detalhes do erro
  if (error.response && error.response.data && error.response.data.message) {
    return new Error(error.response.data.message);
  }
  
  // Caso contrário, retorna uma mensagem padrão
  return new Error("Erro na comunicação com a API.");
}
