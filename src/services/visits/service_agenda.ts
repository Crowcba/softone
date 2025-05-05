import { api } from "../../config/api";
import { 
  VisitasAgenda, 
  VisitasAgendaDetalhada, 
  VisitasAgendaCreate, 
  VisitasAgendaUpdate,
  VisitasAgendaResponse,
  RelatorioKmPrescritor
} from "../../api/visits/agenda";

class AgendaService {
  async getVisitasAgenda(): Promise<VisitasAgendaResponse> {
    try {
      const response = await api.get('/api/VisitasAgendas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar visitas agendadas:', error);
      throw error;
    }
  }

  async getVisitaAgendaById(id: number): Promise<VisitasAgendaDetalhada> {
    try {
      const response = await api.get(`/api/VisitasAgendas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar visita agendada ${id}:`, error);
      throw error;
    }
  }

  async createVisitaAgenda(visita: VisitasAgendaCreate): Promise<VisitasAgenda> {
    try {
      const response = await api.post('/api/VisitasAgendas', visita);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar visita agendada:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Não foi possível criar a visita. O serviço não está disponível no momento.');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Dados inválidos fornecidos para criar a visita. Por favor, verifique os campos e tente novamente.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Sua sessão expirou. Por favor, faça login novamente.');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.');
      }
      
      throw new Error('Erro ao criar visita agendada. Por favor, tente novamente mais tarde.');
    }
  }

  async updateVisitaAgenda(id: number, visita: VisitasAgendaUpdate): Promise<void> {
    try {
      await api.put(`/api/VisitasAgendas/${id}`, visita);
    } catch (error) {
      console.error(`Erro ao atualizar visita agendada ${id}:`, error);
      throw error;
    }
  }

  // Novo método para marcar visita como impressa
  async marcarVisitaComoImpressa(id: number): Promise<void> {
    try {
      console.log(`Marcando visita ${id} como impressa (status 6)`);
      
      // Atualizamos apenas o status da visita para 6 (concluída e impressa)
      await api.put(`/api/VisitasAgendas/${id}`, {
        id: id,
        va_status: 6
      });
      
      return;
    } catch (error) {
      console.error(`Erro ao marcar visita ${id} como impressa:`, error);
      throw error;
    }
  }

  // Método para verificar se visitas já foram impressas
  async verificarStatusImpressao(idsVisitas: number[]): Promise<Record<number, boolean>> {
    try {
      // Podemos otimizar essa função obtendo apenas os IDs e status
      const response = await api.post(`/api/VisitasAgendas/VerificarStatus`, idsVisitas);
      
      if (!response.data) {
        return {};
      }
      
      // Criamos um objeto onde as chaves são os IDs das visitas e os valores são booleanos
      // indicando se a visita foi impressa (status 6)
      const statusImpressao: Record<number, boolean> = {};
      
      // Se a API não tiver um endpoint específico para verificar status, podemos 
      // tratar os dados da resposta aqui
      response.data.forEach((visita: any) => {
        statusImpressao[visita.id] = visita.va_status === 6;
      });
      
      return statusImpressao;
    } catch (error) {
      console.error(`Erro ao verificar status de impressão:`, error);
      return {};
    }
  }

  // Novo método para obter relatório de quilometragem por prescritor
  async getRelatorioKmPrescritor(idUsuario: string): Promise<RelatorioKmPrescritor[]> {
    try {
      console.log(`Iniciando chamada para relatório de quilometragem do usuário ${idUsuario}`);
      
      // Verificar se o ID do usuário é válido
      if (!idUsuario) {
        console.error('ID de usuário inválido fornecido ao getRelatorioKmPrescritor');
        throw new Error('ID de usuário é obrigatório');
      }
      
      // Registrar a URL da chamada
      const url = `/api/Relatorios/KmPrescritor/${idUsuario}`;
      console.log(`Chamando API: ${url}`);
      
      // Fazer a chamada à API
      const response = await api.get<RelatorioKmPrescritor[]>(url);
      
      // Verificar se a resposta contém dados
      if (!response.data) {
        console.warn('API de relatório retornou resposta vazia');
        return [];
      }
      
      console.log(`Sucesso: ${Array.isArray(response.data) ? response.data.length : 0} registros obtidos`);
      
      // Processar os dados para garantir que datas estejam no formato correto
      const dadosProcessados = Array.isArray(response.data) ? response.data.map(item => {
        // Converter datas para o formato ISO se não estiverem
        if (item.data && typeof item.data === 'string' && !item.data.includes('T')) {
          // Se a data estiver apenas no formato YYYY-MM-DD, adicionar o timestamp
          item.data = `${item.data}T00:00:00`;
        }
        
        if (item.rota_data && typeof item.rota_data === 'string') {
          // Garantir que a data da rota esteja em formato ISO
          try {
            const data = new Date(item.rota_data);
            item.rota_data = data.toISOString();
          } catch (error) {
            console.warn(`Erro ao processar data de rota: ${item.rota_data}`, error);
          }
        }
        
        return item;
      }) : [];
      
      // Retornar os dados processados
      return dadosProcessados;
    } catch (error) {
      console.error(`Erro ao buscar relatório de km por prescritor para usuário ${idUsuario}:`, error);
      return [];
    }
  }

  async deleteVisitaAgenda(id: number): Promise<void> {
    try {
      await api.delete(`/api/VisitasAgendas/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir visita agendada ${id}:`, error);
      throw error;
    }
  }

  // Novo método para buscar dados detalhados das visitas de um usuário
  async getVisitasDetalhadasPorUsuario(idUsuario: string): Promise<VisitasAgendaDetalhada[]> {
    try {
      console.log(`Iniciando busca de visitas detalhadas para o usuário ${idUsuario}`);
      
      // 1. Primeiro, buscar as visitas básicas
      const visitas = await this.getVisitasAtivasPorUsuario(idUsuario);
      
      if (!visitas || visitas.length === 0) {
        console.log('Nenhuma visita encontrada para o usuário');
        return [];
      }
      
      console.log(`Encontradas ${visitas.length} visitas. Buscando detalhes...`);
      
      // 2. Para cada visita, buscar os detalhes do prescritor e endereço
      const visitasDetalhadas = await Promise.all(
        visitas.map(async (visita) => {
          try {
            // Criar uma cópia da visita para atualizar
            const visitaDetalhada: VisitasAgendaDetalhada = { ...visita };
            
            // Buscar detalhes do prescritor se tiver ID
            if (visita.id_prescritor) {
              try {
                console.log(`Buscando dados do prescritor ID ${visita.id_prescritor}`);
                const prescritorResponse = await api.get(`/api/VisitasProfissionais/${visita.id_prescritor}`);
                
                if (prescritorResponse.data) {
                  // Mapear campos do prescritor para a visita detalhada
                  visitaDetalhada.nome_profissional = prescritorResponse.data.nomeProfissional;
                  visitaDetalhada.especialidade_profissional = prescritorResponse.data.especialidadeProfissional;
                  visitaDetalhada.sexo_profissional = prescritorResponse.data.sexoProfissional;
                  visitaDetalhada.email_profissional = prescritorResponse.data.emailProfissional;
                  // Outros campos do prescritor conforme necessário
                }
              } catch (error) {
                console.warn(`Não foi possível obter dados do prescritor ID ${visita.id_prescritor}:`, error);
              }
            }
            
            // Buscar detalhes do endereço se tiver ID
            if (visita.id_endereco) {
              try {
                console.log(`Buscando dados do endereço ID ${visita.id_endereco}`);
                const enderecoResponse = await api.get(`/api/VisitasOrigemDestino/${visita.id_endereco}`);
                
                if (enderecoResponse.data) {
                  // Mapear campos do endereço para a visita detalhada
                  visitaDetalhada.endereco_origem_destino = enderecoResponse.data.enderecoOrigemDestino;
                  visitaDetalhada.bairro_origem_destino = enderecoResponse.data.bairroOrigemDestino;
                  visitaDetalhada.cidade_origem_destino = enderecoResponse.data.cidadeOrigemDestino;
                  visitaDetalhada.uf_origem_destino = enderecoResponse.data.ufOrigemDestino;
                  visitaDetalhada.cep_origem_destino = enderecoResponse.data.cepOrigemDestino;
                  visitaDetalhada.telefone_origem_destino = enderecoResponse.data.telefoneOrigemDestino;
                  visitaDetalhada.numero_origem_destino = enderecoResponse.data.numeroOrigemDestino;
                  // Outros campos do endereço conforme necessário
                }
              } catch (error) {
                console.warn(`Não foi possível obter dados do endereço ID ${visita.id_endereco}:`, error);
              }
            }
            
            return visitaDetalhada;
          } catch (error) {
            console.warn(`Erro ao processar detalhes para visita ID ${visita.id}:`, error);
            return visita; // Retornar a visita original se não conseguir buscar detalhes
          }
        })
      );
      
      console.log(`Processamento de detalhes concluído para ${visitasDetalhadas.length} visitas`);
      return visitasDetalhadas;
      
    } catch (error) {
      console.error(`Erro ao buscar visitas detalhadas do usuário ${idUsuario}:`, error);
      throw new Error('Erro ao buscar visitas detalhadas. Por favor, tente novamente mais tarde.');
    }
  }

  async getVisitasAtivasPorUsuario(idUsuario: string): Promise<VisitasAgendaDetalhada[]> {
    try {
      console.log(`Iniciando chamada API para buscar visitas do usuário ${idUsuario}`);
      
      // Verificar se o ID do usuário é válido
      if (!idUsuario) {
        console.error('ID de usuário inválido fornecido ao getVisitasAtivasPorUsuario');
        throw new Error('ID de usuário é obrigatório');
      }
      
      // Primeiro, tentar buscar pelo endpoint específico para o usuário
      try {
        const url = `/api/VisitasAgendas/VisitasAtivasPorUsuario/${idUsuario}`;
        console.log(`Tentando chamada API: ${url}`);
        
        const response = await api.get(url);
        
        console.log('Resposta da API (VisitasAtivasPorUsuario):', 
          JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            dataType: typeof response.data,
            isArray: Array.isArray(response.data),
            dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
            firstItem: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : 'N/A'
          }, null, 2)
        );
        
        if (response.data && (Array.isArray(response.data) || response.data.data)) {
          // Se deu certo, processar e retornar os dados
          if (Array.isArray(response.data)) {
            console.log(`Sucesso: ${response.data.length} visitas obtidas`);
            
            // Mapeamento dos dados para garantir compatibilidade com a interface
            const normalizedData = response.data.map((item: any) => ({
              ...item,
              // Converter status da API para va_status
              va_status: item.status !== undefined ? item.status : 0,
              // Garantir que IDs estejam no formato esperado pelo cliente
              id_prescritor: item.idPrescritor || item.id_prescritor,
              id_endereco: item.idEndereco || item.id_endereco,
              id_usuario: item.idUsuario || item.id_usuario
            }));
            
            return normalizedData;
          }
          
          if (response.data.data && Array.isArray(response.data.data)) {
            console.log(`Sucesso: ${response.data.data.length} visitas obtidas (formato alternativo)`);
            
            // Mapeamento dos dados para garantir compatibilidade com a interface
            const normalizedData = response.data.data.map((item: any) => ({
              ...item,
              // Converter status da API para va_status
              va_status: item.status !== undefined ? item.status : 0,
              // Garantir que IDs estejam no formato esperado pelo cliente
              id_prescritor: item.idPrescritor || item.id_prescritor,
              id_endereco: item.idEndereco || item.id_endereco,
              id_usuario: item.idUsuario || item.id_usuario
            }));
            
            return normalizedData;
          }
        }
      } catch (error: any) {
        console.log(`Endpoint específico por usuário não disponível: ${error.message}`);
        // Continuar com a próxima abordagem
      }
      
      // Se não funcionou, tentar buscar todas as visitas e filtrar pelo usuário
      try {
        console.log(`Tentando buscar todas as visitas e filtrar pelo usuário ${idUsuario}`);
        const allVisitsResponse = await api.get('/api/VisitasAgendas');
        
        if (allVisitsResponse.data) {
          let allVisits = allVisitsResponse.data;
          
          // Ajustar se a resposta for no formato { data: [...] }
          if (!Array.isArray(allVisits) && allVisits.data && Array.isArray(allVisits.data)) {
            allVisits = allVisits.data;
          }
          
          if (Array.isArray(allVisits)) {
            // Filtrar por idUsuario
            const filteredVisits = allVisits.filter((visita) => 
              visita.idUsuario === idUsuario || 
              visita.id_usuario === idUsuario
            );
            
            console.log(`Encontradas ${filteredVisits.length} visitas para o usuário ${idUsuario}`);
            
            // Normalizar os dados
            const normalizedData = filteredVisits.map((item: any) => ({
              ...item,
              // Converter status da API para va_status
              va_status: item.status !== undefined ? item.status : 0,
              // Garantir que IDs estejam no formato esperado pelo cliente
              id_prescritor: item.idPrescritor || item.id_prescritor,
              id_endereco: item.idEndereco || item.id_endereco,
              id_usuario: item.idUsuario || item.id_usuario
            }));
            
            return normalizedData;
          }
        }
      } catch (error: any) {
        console.log(`Não foi possível buscar todas as visitas: ${error.message}`);
        // Continuar com a próxima abordagem
      }
      
      // Se nada funcionou, usar dados de exemplo em ambiente de desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log('Utilizando dados de exemplo para testes');
        return this.getExampleData();
      }
      
      // Se chegou aqui, não conseguiu dados de nenhuma forma
      console.warn('Não foi possível obter visitas do usuário por nenhum método');
      return [];
    } catch (error: any) {
      console.error(`Erro ao buscar visitas ativas do usuário ${idUsuario}:`, error);
      
      if (error.response?.status === 404) {
        console.warn('Nenhuma visita encontrada para o usuário');
        return [];
      }
      
      throw new Error('Erro ao buscar visitas. Por favor, tente novamente mais tarde.');
    }
  }
  
  // Método para gerar dados de exemplo para testes quando a API falha
  private getExampleData(): VisitasAgendaDetalhada[] {
    console.log('Gerando dados de exemplo para testes');
    
    // Obter a data atual no formato YYYY-MM-DD
    const hoje = new Date();
    const dataHoje = hoje.toISOString().split('T')[0];
    
    // Criar data futura (amanhã)
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAmanha = amanha.toISOString().split('T')[0];
    
    // Importante: Os dados de exemplo devem ter tanto status quanto va_status
    // para garantir compatibilidade com a interface e qualquer código que use os dados
    const dados = [
      {
        id: 9001,
        status: 1, // Agendado (campo original da API)
        va_status: 1, // Agendado (campo usado na interface do cliente)
        id_prescritor: 1,
        nome_profissional: 'Dr. João Silva',
        especialidade_profissional: 'Cardiologia',
        id_endereco: 101,
        endereco_origem_destino: 'Rua das Flores, 123',
        cidade_origem_destino: 'São Paulo',
        uf_origem_destino: 'SP',
        telefone_origem_destino: '(11) 99123-4567',
        data: dataHoje,
        periodo: 0, // Manhã
        tipo: 1,
        descricao: 'Visita agendada para apresentação de novo medicamento'
      },
      {
        id: 9002,
        status: 2, // Confirmado (campo original da API)
        va_status: 2, // Confirmado (campo usado na interface do cliente)
        id_prescritor: 2,
        nome_profissional: 'Dra. Maria Santos',
        especialidade_profissional: 'Pediatria',
        id_endereco: 102,
        endereco_origem_destino: 'Avenida Paulista, 1500',
        cidade_origem_destino: 'São Paulo',
        uf_origem_destino: 'SP',
        telefone_origem_destino: '(11) 98765-4321',
        data: dataHoje,
        periodo: 1, // Tarde
        tipo: 2,
        descricao: 'Reunião para discussão de caso clínico'
      },
      {
        id: 9003,
        status: 3, // Concluído (campo original da API)
        va_status: 3, // Concluído (campo usado na interface do cliente)
        id_prescritor: 3,
        nome_profissional: 'Dr. Carlos Oliveira',
        especialidade_profissional: 'Neurologia',
        id_endereco: 103,
        endereco_origem_destino: 'Rua Augusta, 789',
        cidade_origem_destino: 'São Paulo',
        uf_origem_destino: 'SP',
        telefone_origem_destino: '(11) 97654-3210',
        data: dataHoje,
        periodo: 2, // Integral
        tipo: 1,
        descricao: 'Visita para atualização sobre novos tratamentos'
      },
      {
        id: 9004,
        status: 4, // Finalizado (campo original da API)
        va_status: 4, // Finalizado (campo usado na interface do cliente)
        id_prescritor: 4,
        nome_profissional: 'Dra. Ana Pereira',
        especialidade_profissional: 'Dermatologia',
        id_endereco: 104,
        endereco_origem_destino: 'Rua Oscar Freire, 456',
        cidade_origem_destino: 'São Paulo',
        uf_origem_destino: 'SP',
        telefone_origem_destino: '(11) 96543-2109',
        data: dataAmanha,
        periodo: 0, // Manhã
        tipo: 2,
        descricao: 'Apresentação de nova linha de produtos'
      }
    ];

    // Converter para o tipo VisitasAgendaDetalhada
    return dados.map(item => {
      // Criar um objeto compatível com VisitasAgendaDetalhada
      const result: VisitasAgendaDetalhada = {
        ...item,
        id: item.id,
        id_prescritor: item.id_prescritor,
        va_status: item.va_status
      };
      
      // Remover o campo status que não faz parte da interface
      delete (result as any).status;
      
      return result;
    });
  }
}

let service: AgendaService;

export async function getAgendaService(): Promise<AgendaService> {
  if (!service) {
    service = new AgendaService();
  }
  return service;
} 