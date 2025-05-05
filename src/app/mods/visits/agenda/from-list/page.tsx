'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getAgendaService } from '@/services/visits/service_agenda';
import { localPrescritorService } from '@/services/visits/service_visits_agenda_list';
import { getPrescriberListService } from '@/services/visits/service_visits_list_agenda_prescribers';
import styles from './from-list.module.css';

// Componente de Skeleton para carregamento
const ListSkeleton = () => (
  <div className={styles.skeleton}>
    {[...Array(5)].map((_, index) => (
      <div key={index} className={styles.skeletonItem}>
        <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
        <div className={styles.skeletonLine} style={{ width: '50%' }}></div>
        <div className={styles.skeletonLine} style={{ width: '20%' }}></div>
      </div>
    ))}
  </div>
);

// Tipos de visita disponíveis para seleção
const tiposVisita = [
  { id: 1, nome: 'Prospecção' },
  { id: 2, nome: 'Apresentação de produto' },
  { id: 3, nome: 'Reposição de material promocional' },
  { id: 4, nome: 'Treinamento técnico' },
  { id: 5, nome: 'Acompanhamento/pós-venda' },
  { id: 6, nome: 'Atualização científica' },
  { id: 7, nome: 'Coleta de feedback' },
  { id: 8, nome: 'Negociação comercial' },
  { id: 9, nome: 'Suporte' },
  { id: 10, nome: 'Eventos/convites' },
  { id: 11, nome: 'Relacionamento' },
  { id: 12, nome: 'Cadastro de novos médicos' }
];

export default function AgendaFromListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingPrescribers, setLoadingPrescribers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para listas e prescritores
  const [listas, setListas] = useState<any[]>([]);
  const [prescribersByList, setPrescribersByList] = useState<Record<number, any[]>>({});
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    listaId: 0,
    data: '',
    periodo: 0,
    tipo: 1, // Prospecção como padrão
    descricao: ''
  });
  
  // Estado do carregamento de prescritores da lista selecionada
  const [selectedListPrescribers, setSelectedListPrescribers] = useState<any[]>([]);
  
  // Buscar listas e inicializar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Buscar listas de prescritores do usuário atual
        const userId = Cookies.get('user_id');
        if (!userId) {
          setError('Usuário não identificado. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }
        
        const listaData = await localPrescritorService.getByUsuario(userId);
        setListas(listaData || []);
        
        // Definir data padrão (amanhã)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          data: formatDateForInput(tomorrow)
        }));
        
      } catch (error) {
        console.error('Erro ao carregar listas:', error);
        setError('Erro ao carregar listas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Formatar data para input (yyyy-MM-dd)
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Converter data do formato de input para API (yyyy-MM-dd)
  const formatDateForApi = (dateStr: string): string => {
    // Como a API espera YYYY-MM-DD e o input HTML date já fornece nesse formato,
    // não precisamos converter
    return dateStr;
  };

  // Obter a data mínima permitida (hoje)
  const getTodayFormatted = (): string => {
    // Cria uma nova data atual (hoje)
    const today = new Date();
    // Formatar para YYYY-MM-DD
    return formatDateForInput(today);
  };
  
  // Buscar prescritores de uma lista
  const loadPrescribersForList = useCallback(async (listaId: number) => {
    if (listaId <= 0) {
      setSelectedListPrescribers([]);
      return;
    }
    
    try {
      setLoadingPrescribers(true);
      
      // Verificar se já temos esses prescritores em cache
      if (prescribersByList[listaId]) {
        setSelectedListPrescribers(prescribersByList[listaId]);
        setLoadingPrescribers(false);
        return;
      }
      
      // Buscar prescritores da lista
      const prescriberListService = await getPrescriberListService();
      const prescribers = await prescriberListService.getPrescribersByList(listaId);
      
      // Atualizar cache e estado
      setPrescribersByList(prev => ({
        ...prev,
        [listaId]: prescribers
      }));
      setSelectedListPrescribers(prescribers);
      
    } catch (error) {
      console.error('Erro ao carregar prescritores da lista:', error);
      toast.error('Não foi possível carregar os prescritores desta lista.');
      setSelectedListPrescribers([]);
    } finally {
      setLoadingPrescribers(false);
    }
  }, [prescribersByList]);
  
  // Mudar lista selecionada
  const handleListChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const listaId = Number(e.target.value);
    setFormData(prev => ({ ...prev, listaId }));
    
    // Buscar detalhes da lista e prescritores
    if (listaId > 0) {
      await loadPrescribersForList(listaId);
    } else {
      setSelectedListPrescribers([]);
    }
  };
  
  // Atualizar campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'tipo' || name === 'listaId' || name === 'periodo' 
        ? Number(value) 
        : value 
    }));
  };
  
  // Atualizar período
  const handlePeriodoChange = (periodo: number) => {
    setFormData(prev => ({ ...prev, periodo }));
  };
  
  // Criar agendamentos para todos os prescritores da lista
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    // Validações
    if (!formData.listaId) {
      setError('Por favor, selecione uma lista de prescritores.');
      return;
    }
    
    if (!formData.data) {
      setError('Por favor, selecione uma data para o agendamento.');
      return;
    }
    
    // Validar que a data não é anterior à data atual
    // Extrair componentes de data do formData.data (formato: YYYY-MM-DD)
    const [selectedYear, selectedMonth, selectedDay] = formData.data.split('-').map(Number);
    
    // Obter componentes da data atual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11
    const currentDay = now.getDate();
    
    // Criar strings para comparação direta
    const selectedDateStr = `${selectedYear}${selectedMonth.toString().padStart(2, '0')}${selectedDay.toString().padStart(2, '0')}`;
    const currentDateStr = `${currentYear}${currentMonth.toString().padStart(2, '0')}${currentDay.toString().padStart(2, '0')}`;
    
    // Comparar como strings numéricas (20250402 vs 20250402)
    if (selectedDateStr < currentDateStr) {
      setError('Não é possível agendar para datas anteriores à atual.');
      return;
    }
    
    if (selectedListPrescribers.length === 0) {
      setError('A lista selecionada não contém prescritores.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Buscar local associado à lista
      const selectedList = listas.find(lista => lista.id === formData.listaId);
      if (!selectedList) {
        throw new Error('Lista não encontrada');
      }
      
      const localId = selectedList.idLocal;
      
      // Serviço para criar as agendas
      const agendaService = await getAgendaService();
      const userId = Cookies.get('user_id');
      
      if (!userId) {
        setError('Usuário não identificado. Por favor, faça login novamente.');
        return;
      }
      
      // Contadores para feedback
      let successCount = 0;
      let errorCount = 0;
      
      // Criar um agendamento para cada prescritor na lista
      const createPromises = selectedListPrescribers.map(async (prescriberInList) => {
        try {
          const agendaData = {
            idPrescritor: prescriberInList.idPrescritor,
            idEndereco: localId,
            idUsuario: userId,
            data: formatDateForApi(formData.data),
            descricao: formData.descricao,
            periodo: formData.periodo,
            tipo: formData.tipo,
            status: 1, // Agendado
            ativo: true
          };
          
          await agendaService.createVisitaAgenda(agendaData);
          successCount++;
          return true;
        } catch (error) {
          console.error(`Erro ao criar agendamento para prescritor ${prescriberInList.idPrescritor}:`, error);
          errorCount++;
          return false;
        }
      });
      
      // Aguardar todas as requisições
      await Promise.all(createPromises);
      
      // Mostrar feedback
      if (successCount > 0) {
        toast.success(`${successCount} agendamentos criados com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`Falha ao criar ${errorCount} agendamentos.`);
      }
      
      // Redirecionar para lista de agendas
      router.push('/mods/visits/agenda');
      
    } catch (error) {
      console.error('Erro ao criar agendamentos:', error);
      setError('Ocorreu um erro ao criar os agendamentos. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Cancelar e voltar para lista
  const handleCancel = () => {
    router.push('/mods/visits/agenda');
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Agendamentos em Lote</h1>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={submitting || selectedListPrescribers.length === 0}
          >
            {submitting ? 'Criando agendamentos...' : 'Criar agendamentos'}
          </button>
        </div>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <ListSkeleton />
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Selecione a Lista e a Data</h2>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="listaId">Lista de Prescritores *</label>
                <select
                  id="listaId"
                  name="listaId"
                  className={styles.select}
                  value={formData.listaId}
                  onChange={handleListChange}
                  required
                  aria-label="Selecione uma lista de prescritores"
                >
                  <option value="0">Selecione uma lista...</option>
                  {listas.map(lista => (
                    <option key={lista.id} value={lista.id}>
                      {lista.descricao}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="data">Data do Agendamento *</label>
                <div className={styles.dateInputContainer}>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    className={styles.input}
                    value={formData.data}
                    onChange={handleChange}
                    required
                    aria-label="Data do agendamento"
                  />
                  {formData.data && (
                    <div className={styles.dateDisplay}>
                      {/* Exibir a data em formato brasileiro */}
                      {formData.data.split('-')[2]}/{formData.data.split('-')[1]}/{formData.data.split('-')[0]}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Período *</label>
                <div className={styles.periodRadio}>
                  <div className={styles.radioGroup}>
                    <input
                      type="radio"
                      id="periodoManha"
                      name="periodo"
                      checked={formData.periodo === 0}
                      onChange={() => handlePeriodoChange(0)}
                    />
                    <label htmlFor="periodoManha" className={styles.radioLabel}>Manhã</label>
                  </div>
                  <div className={styles.radioGroup}>
                    <input
                      type="radio"
                      id="periodoTarde"
                      name="periodo"
                      checked={formData.periodo === 1}
                      onChange={() => handlePeriodoChange(1)}
                    />
                    <label htmlFor="periodoTarde" className={styles.radioLabel}>Tarde</label>
                  </div>
                  <div className={styles.radioGroup}>
                    <input
                      type="radio"
                      id="periodoIntegral"
                      name="periodo"
                      checked={formData.periodo === 2}
                      onChange={() => handlePeriodoChange(2)}
                    />
                    <label htmlFor="periodoIntegral" className={styles.radioLabel}>Integral</label>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="tipo">Tipo de Visita *</label>
                <select
                  id="tipo"
                  name="tipo"
                  className={styles.select}
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  {tiposVisita.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                className={styles.textarea}
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Detalhes sobre a visita (opcional)"
                rows={3}
              />
            </div>
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Prescritores na Lista
              {loadingPrescribers && <span className={styles.loadingText}> (Carregando...)</span>}
            </h2>
            
            {selectedListPrescribers.length > 0 ? (
              <div className={styles.prescribersList}>
                {selectedListPrescribers.map((prescriberInList, index) => (
                  <div key={index} className={styles.prescriberItem}>
                    <div className={styles.prescriberName}>
                      {prescriberInList.nome || `Prescritor ID: ${prescriberInList.idPrescritor}`}
                    </div>
                  </div>
                ))}
                
                <div className={styles.summaryInfo}>
                  Total de agendamentos a serem criados: {selectedListPrescribers.length}
                </div>
              </div>
            ) : (
              <div className={styles.emptyList}>
                {formData.listaId > 0 && !loadingPrescribers ? 
                  'Esta lista não contém prescritores.' : 
                  'Selecione uma lista para ver os prescritores.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
