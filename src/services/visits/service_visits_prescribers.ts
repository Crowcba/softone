import axios from 'axios';
import { getAuthConfig } from '../../utils/auth';

// Interface atualizada conforme documentação
export interface VisitasProfissional {
  idProfissional: number;
  nomeProfissional: string;
  sexoProfissional: string;
  dataNascimentoProfissional: string;
  profissaoProfissional: string;
  especialidadeProfissional: string;
  conselhoProfissional: string;
  numeroConselhoProfissional: string;
  emailProfissional: string;
  idPromotor: string;
  idConselho?: number | null;
  idEstadoConselho?: number | null;
  status: boolean;
}

class VisitasProfissionaisService {
  private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // GET /api/VisitasProfissionais
  static async getAllVisitasProfissionais(): Promise<VisitasProfissional[]> {
    try {
      const response = await axios.get(
        `${this.API_BASE_URL}/api/VisitasProfissionais`,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar profissionais:", error.message);
      return [];
    }
  }

  // GET /api/VisitasProfissionais/{id}
  static async getVisitasProfissionalById(id: number): Promise<VisitasProfissional | null> {
    try {
      const response = await axios.get(
        `${this.API_BASE_URL}/api/VisitasProfissionais/${id}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao buscar profissional ${id}:`, error.message);
      return null;
    }
  }

  // POST /api/VisitasProfissionais
  static async createVisitasProfissional(
    profissional: Omit<VisitasProfissional, 'idProfissional'>
  ): Promise<VisitasProfissional | null> {
    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/api/VisitasProfissionais`,
        profissional,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      console.error("Erro ao criar profissional:", error.message);
      return null;
    }
  }

  // PUT /api/VisitasProfissionais/{id}
  static async updateVisitasProfissional(
    id: number, 
    profissional: VisitasProfissional
  ): Promise<VisitasProfissional | null> {
    try {
      const response = await axios.put(
        `${this.API_BASE_URL}/api/VisitasProfissionais/${id}`,
        profissional,
        getAuthConfig()
      );
      return response.data;
    } catch (error: any) {
      console.error(`Erro ao atualizar profissional ${id}:`, error.message);
      return null;
    }
  }

  // DELETE /api/VisitasProfissionais/{id}
  static async deleteVisitasProfissional(id: number): Promise<boolean> {
    try {
      await axios.delete(
        `${this.API_BASE_URL}/api/VisitasProfissionais/${id}`,
        getAuthConfig()
      );
      return true;
    } catch (error: any) {
      console.error(`Erro ao excluir profissional ${id}:`, error.message);
      return false;
    }
  }

  // PATCH /api/VisitasProfissionais/status/{id}
  static async updateStatus(id: number, status: boolean): Promise<boolean> {
    try {
      const config = {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          'Content-Type': 'application/json'
        }
      };

      await axios.patch(
        `${this.API_BASE_URL}/api/VisitasProfissionais/status/${id}`,
        status.toString(),
        config
      );
      return true;
    } catch (error: any) {
      console.error(`Erro ao atualizar status do profissional ${id}:`, error.message);
      return false;
    }
  }

  // PATCH /api/VisitasProfissionais/promotor/{id}/{idPromotor}
  static async updatePromotor(id: number, idPromotor: string): Promise<boolean> {
    try {
      await axios.patch(
        `${this.API_BASE_URL}/api/VisitasProfissionais/promotor/${id}/${idPromotor}`,
        null,
        getAuthConfig()
      );
      return true;
    } catch (error: any) {
      console.error(`Erro ao atualizar promotor do profissional ${id}:`, error.message);
      return false;
    }
  }
}

export default VisitasProfissionaisService; 