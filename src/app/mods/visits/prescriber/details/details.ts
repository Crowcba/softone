import { useState } from 'react';
import VisitasProfissionaisService, { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';

export function usePrescriberDetails() {
  const [loading, setLoading] = useState(false);

  const fetchPrescriberDetails = async (id: number): Promise<VisitasProfissional | null> => {
    try {
      setLoading(true);
      const data = await VisitasProfissionaisService.getVisitasProfissionalById(id);
      return data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do prescritor:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePrescriberStatus = async (id: number, newStatus: boolean): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await VisitasProfissionaisService.updateStatus(id, newStatus);
      return success;
    } catch (error) {
      console.error('Erro ao atualizar status do prescritor:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchPrescriberDetails,
    updatePrescriberStatus
  };
} 