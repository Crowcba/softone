import { visitsPrescriber } from "../../api/visits/visits_prescriber";
import { api } from "../../config/api";

class VisitsService {
    async getPrescribers(): Promise<visitsPrescriber[]> {
        try {
            const response = await api.get('/api/VisitasProfissionais');
            
            // Mapear os dados do formato da API para o formato esperado pelo frontend
            return response.data.map((item: any) => ({
                // Campos mapeados para o formato visitsPrescriber
                idPrescriber: item.idProfissional,
                nomePrescriber: item.nomeProfissional,
                crmPrescriber: item.numeroConselhoProfissional || '',
                especialidadePrescriber: item.especialidadeProfissional || '',
                status: item.status,
                telefone: '',
                email: item.emailProfissional || '',
                observacoes: '',
                
                // Campos originais preservados
                idProfissional: item.idProfissional,
                nomeProfissional: item.nomeProfissional,
                sexoProfissional: item.sexoProfissional,
                dataNascimentoProfissional: item.dataNascimentoProfissional,
                profissaoProfissional: item.profissaoProfissional,
                especialidadeProfissional: item.especialidadeProfissional,
                conselhoProfissional: item.conselhoProfissional,
                numeroConselhoProfissional: item.numeroConselhoProfissional,
                emailProfissional: item.emailProfissional,
                idPromotor: item.idPromotor
            }));
        } catch (error) {
            console.error('Erro ao buscar prescritores:', error);
            throw error;
        }
    }

    async getPrescriberById(id: number): Promise<visitsPrescriber> {
        try {
            const response = await api.get(`/api/VisitasProfissionais/${id}`);
            const item = response.data;
            
            // Mapear os dados do formato da API para o formato esperado pelo frontend
            return {
                // Campos mapeados para o formato visitsPrescriber
                idPrescriber: item.idProfissional,
                nomePrescriber: item.nomeProfissional,
                crmPrescriber: item.numeroConselhoProfissional || '',
                especialidadePrescriber: item.especialidadeProfissional || '',
                status: item.status,
                telefone: '',
                email: item.emailProfissional || '',
                observacoes: '',
                
                // Campos originais preservados
                idProfissional: item.idProfissional,
                nomeProfissional: item.nomeProfissional,
                sexoProfissional: item.sexoProfissional,
                dataNascimentoProfissional: item.dataNascimentoProfissional,
                profissaoProfissional: item.profissaoProfissional,
                especialidadeProfissional: item.especialidadeProfissional,
                conselhoProfissional: item.conselhoProfissional,
                numeroConselhoProfissional: item.numeroConselhoProfissional,
                emailProfissional: item.emailProfissional,
                idPromotor: item.idPromotor
            };
        } catch (error) {
            console.error('Erro ao buscar prescritor:', error);
            throw error;
        }
    }
}

let service: VisitsService;

export async function getVisitsService(): Promise<VisitsService> {
    if (!service) {
        service = new VisitsService();
    }
    return service;
} 