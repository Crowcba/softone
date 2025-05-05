interface Link {
  id: number;
  professionalId: number;
  // Adicione outros campos necessários
}

export const handleGetLinksByProfessionalId = async (professionalId: number): Promise<Link[]> => {
  try {
    const response = await fetch(`/api/visits/prescribers/${professionalId}/links`);
    if (!response.ok) {
      throw new Error('Falha ao obter links');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar links:', error);
    throw error;
  }
};

export const handleCreateLink = async (data: Partial<Link>): Promise<Link> => {
  try {
    const response = await fetch('/api/visits/prescribers/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Falha ao criar link');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar link:', error);
    throw error;
  }
};

export const handleUpdateLink = async (id: number, data: Partial<Link>): Promise<Link> => {
  try {
    const response = await fetch(`/api/visits/prescribers/links/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Falha ao atualizar link');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    throw error;
  }
}; 