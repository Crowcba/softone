interface UserInfo {
  id: number;
  name: string;
  email: string;
  // Adicione outros campos necessários
}

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await fetch('/api/user/info');
    if (!response.ok) {
      throw new Error('Falha ao obter informações do usuário');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    throw error;
  }
}; 