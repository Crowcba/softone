'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getAgendaService } from '@/services/visits/service_agenda';
import { visitsPrescriber } from '@/api/visits/visits_prescriber';
import { getLocations } from '@/services/visits/service_visits_locations';
import { handleGetLinksByProfessionalId } from '@/services/visits/service_visits_address_professional_links';
import { 
  verificarVinculoProfissionalLocal, 
  criarVinculo, 
  salvarAgendaComCache, 
  verificarAgendaSalva 
} from '@/services/visits/service_visits_verification';
import PrescribersList from '@/components/visits/PrescribersList';
import styles from './register.module.css';
import { format } from 'date-fns';

export default function RegisterVisitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [locations, setLocations] = useState<any[]>([]);
  
  const [searchLocation, setSearchLocation] = useState('');
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [hasLocationLink, setHasLocationLink] = useState(false);
  const [isUserLinked, setIsUserLinked] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [showChangeLocationOption, setShowChangeLocationOption] = useState(false);
  
  const [formData, setFormData] = useState({
    idPrescritor: 0,
    prescritorNome: '',
    idEndereco: 0,
    enderecoNome: '',
    data: '',
    descricao: '',
    produto: 0,
    periodo: 0,
    tipo: 1, // Tipo padrão: Prospecção
    status: 1, // Agendado
    ativo: true
  });

  // Tipos de visita disponíveis
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

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Carregar locais
        const locationsData = await getLocations();
        if (locationsData) {
          setLocations(locationsData);
        }
        
        // Definir data padrão (amanhã)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          data: formatDateForInput(tomorrow)
        }));
        
        // Carregar dados para edição se for o caso
        if (isEditing && id) {
          try {
            const agendaService = await getAgendaService();
            const visitaData = await agendaService.getVisitaAgendaById(parseInt(id));
            
            if (visitaData) {
              // Formatar data de dd-mm-yyyy para yyyy-mm-dd
              const [day, month, year] = (visitaData.data || '').split('-');
              const formattedDate = day && month && year ? `${year}-${month}-${day}` : '';
              
              // Encontrar local (prescritor será obtido pelo componente)
              const local = locationsData?.find(l => l.idOrigemDestino === visitaData.id_endereco);
              
              // Definir valores iniciais do formulário
              setFormData({
                idPrescritor: visitaData.id_prescritor || 0,
                prescritorNome: visitaData.nome_profissional || '',
                idEndereco: visitaData.id_endereco || 0,
                enderecoNome: local?.localDeAtendimentoOrigemDestino || '',
                data: formattedDate,
                descricao: visitaData.descricao || '',
                produto: visitaData.produto || 0,
                periodo: visitaData.periodo || 0,
                // Tentar obter o tipo da visita a partir do campo tipo ou da string tipo_visita
                tipo: visitaData.tipo || 
                       (visitaData.tipo_visita ? parseInt(visitaData.tipo_visita) : 1),
                status: visitaData.va_status || 1,
                ativo: visitaData.ativo !== false
              });
              
              if (visitaData.id_prescritor) {
                await checkPrescriberLocation(visitaData.id_prescritor);
              }
            }
          } catch (error) {
            console.error('Erro ao carregar dados da visita:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditing]);

  // Formatar data para o formato do input date (yyyy-MM-dd)
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Converter data do formato do input (yyyy-MM-dd) para formato da API (yyyy-MM-dd)
  const formatDateForApi = (dateStr: string): string => {
    // Como a API espera YYYY-MM-DD e o input HTML date já fornece nesse formato, 
    // não precisamos converter, apenas garantir que a data está correta
    return dateStr;
  };

  // Obter a data mínima permitida (hoje)
  const getTodayFormatted = (): string => {
    // Cria uma nova data atual (hoje)
    const today = new Date();
    // Formatar para YYYY-MM-DD
    return formatDateForInput(today);
  };

  // Verificar se prescritor tem local vinculado
  const checkPrescriberLocation = async (prescriberId: number) => {
    try {
      setLoadingLocation(true);
      const userId = Cookies.get('user_id');
      
      // Buscar vínculos do prescritor usando a nova API
      const links = await handleGetLinksByProfessionalId(prescriberId);
      
      if (links && links.length > 0) {
        // Encontrou vínculos para este prescritor
        setHasLocationLink(true);
        
        // Verificar se algum dos vínculos é com o usuário logado
        const userLink = links.find(link => link.idUsuario === userId);
        
        if (userLink) {
          // Encontrou vínculo com o usuário logado
          setIsUserLinked(true);
          
          // Buscar informações detalhadas do local para exibir
          const matchingLocation = locations.find(loc => 
            loc.idOrigemDestino === userLink.idOrigemDestinoOrigemDestino);
          
          if (matchingLocation) {
            setSelectedLocation(matchingLocation);
            setFormData(prev => ({
              ...prev,
              idEndereco: matchingLocation.idOrigemDestino,
              enderecoNome: matchingLocation.localDeAtendimentoOrigemDestino
            }));
            setSearchLocation(matchingLocation.localDeAtendimentoOrigemDestino);
          }
        } else {
          // Tem vínculos, mas não com o usuário logado
          setIsUserLinked(false);
          setFormData(prev => ({
            ...prev,
            idEndereco: 0,
            enderecoNome: ''
          }));
          setSearchLocation('');
        }
      } else {
        // Prescritor não tem vínculos
        setHasLocationLink(false);
        setIsUserLinked(false);
        setFormData(prev => ({
          ...prev,
          idEndereco: 0,
          enderecoNome: ''
        }));
        setSearchLocation('');
      }
    } catch (error) {
      console.error('Erro ao verificar vínculos do prescritor:', error);
      // Em caso de erro, assumir que não tem vínculos
      setHasLocationLink(false);
      setIsUserLinked(false);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Filtrar locais
  const filteredLocations = locations.filter(local => {
    const searchLower = searchLocation.toLowerCase();
    return (local.localDeAtendimentoOrigemDestino && local.localDeAtendimentoOrigemDestino.toLowerCase().includes(searchLower)) ||
           (local.cidadeOrigemDestino && local.cidadeOrigemDestino.toLowerCase().includes(searchLower));
  });

  // Selecionar local
  const handleLocationSelect = (local: any) => {
    setFormData(prev => ({
      ...prev,
      idEndereco: local.idOrigemDestino,
      enderecoNome: local.localDeAtendimentoOrigemDestino
    }));
    setSearchLocation(local.localDeAtendimentoOrigemDestino);
    setIsLocationsOpen(false);
  };

  // Selecionar prescritor com o novo componente
  const handlePrescriberSelect = async (prescritor: visitsPrescriber) => {
    setFormData(prev => ({
      ...prev,
      idPrescritor: prescritor.idPrescriber,
      prescritorNome: prescritor.nomePrescriber
    }));
    
    // Verificar se o prescritor tem local vinculado
    await checkPrescriberLocation(prescritor.idPrescriber);
  };

  // Habilitar troca de local
  const handleChangeLocation = () => {
    setShowChangeLocationOption(true);
  };

  // Atualizar campo de form - expandindo para incluir select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'tipo' ? parseInt(value) : value }));
  };

  // Atualizar período
  const handlePeriodoChange = (periodo: number) => {
    setFormData(prev => ({ ...prev, periodo }));
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Validações
      if (!formData.idPrescritor) {
        setError('Por favor, selecione um prescritor.');
        setSubmitting(false);
        return;
      }
      
      // Local é obrigatório apenas se houver vínculos com o prescritor
      if (hasLocationLink && !formData.idEndereco) {
        setError('Por favor, selecione um local de atendimento.');
        setSubmitting(false);
        return;
      }
      
      if (!formData.data) {
        setError('Por favor, informe a data do agendamento.');
        setSubmitting(false);
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
        setSubmitting(false);
        return;
      }
      
      const userId = Cookies.get('user_id');
      
      if (!userId) {
        setError('Usuário não identificado. Por favor, faça login novamente.');
        setSubmitting(false);
        return;
      }

      // Verificar vínculo entre profissional e local
      if (formData.idEndereco) {
        console.log("Verificando vínculo entre profissional e local...");
        const vinculoExiste = await verificarVinculoProfissionalLocal(
          formData.idPrescritor, 
          formData.idEndereco
        );
        
        if (!vinculoExiste) {
          console.log("Vínculo não encontrado, tentando criar...");
          // Mostrar mensagem informando que estamos criando o vínculo
          toast.info("Criando vínculo entre profissional e local...");
          
          // Tentar criar o vínculo
          const vinculoCriado = await criarVinculo(
            formData.idPrescritor,
            formData.idEndereco,
            userId
          );
          
          if (!vinculoCriado) {
            // Informar que não foi possível criar o vínculo mas prosseguir
            toast.warn("Não foi possível criar o vínculo automaticamente, mas tentaremos salvar o agendamento.");
          } else {
            toast.success("Vínculo criado com sucesso!");
          }
        }
      }
      
      const agendaService = await getAgendaService();
      
      const dadosFormatados = {
        idPrescritor: formData.idPrescritor,
        idEndereco: formData.idEndereco || 0, // Usar 0 se não houver local selecionado
        idUsuario: userId,
        data: formatDateForApi(formData.data),
        descricao: formData.descricao,
        produto: formData.produto,
        periodo: formData.periodo,
        tipo: formData.tipo, // Adicionar o tipo da visita
        status: formData.status,
        ativo: formData.ativo
      };
      
      console.log("Dados formatados para salvar:", dadosFormatados);
      
      try {
        if (isEditing && id) {
          // Para edição, usar o método original
          await agendaService.updateVisitaAgenda(parseInt(id), {
            ...dadosFormatados,
            id: parseInt(id)
          });
          toast.success('Agendamento atualizado com sucesso!');
          router.push('/mods/visits/agenda');
        } else {
          // Para criação, usar o método com cache local
          const resultado = await salvarAgendaComCache(dadosFormatados);
          
          if (resultado.success) {
            // Salvo com sucesso na API
            toast.success('Agendamento criado com sucesso!');
            
            // Verificação adicional para confirmar que realmente foi salvo
            if (resultado.id) {
              const confirmacao = await verificarAgendaSalva(resultado.id);
              if (!confirmacao) {
                // Alerta de que foi "salvo", mas não encontrado na verificação
                toast.info('O agendamento foi salvo, mas não pôde ser verificado. Verificaremos novamente mais tarde.');
              }
            }
            
            router.push('/mods/visits/agenda');
          } else {
            // Salvo apenas localmente
            toast.warn(resultado.message);
            toast.info('O agendamento será enviado automaticamente quando a conexão for restaurada.');
            
            // Redirecionar mesmo assim, já que temos o backup local
            router.push('/mods/visits/agenda');
          }
        }
      } catch (error) {
        console.error('Erro ao salvar na API:', error);
        setError('Erro ao comunicar com o servidor. Por favor, tente novamente.');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      setError('Erro ao salvar agendamento. Por favor, tente novamente.');
      setSubmitting(false);
    } finally {
      if (submitting) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</h1>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={() => router.push('/mods/visits/agenda')}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <p>Carregando...</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <PrescribersList
                  onSelect={handlePrescriberSelect}
                  initialValue={formData.prescritorNome}
                  className={styles.selectSearch}
                  required={true}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="local">
                  Local de Atendimento {hasLocationLink ? '*' : '(opcional)'}
                </label>
                {loadingLocation ? (
                  <div className={styles.loadingText}>Verificando local...</div>
                ) : (
                  <>
                    {/* Se não tem vínculo ou não é com usuário logado ou solicitou troca */}
                    {(!hasLocationLink || !isUserLinked || showChangeLocationOption) ? (
                      <div className={styles.selectSearch}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder={hasLocationLink ? "Buscar local..." : "Local opcional..."}
                          value={searchLocation}
                          onChange={(e) => {
                            setSearchLocation(e.target.value);
                            setIsLocationsOpen(true);
                          }}
                          onClick={() => setIsLocationsOpen(true)}
                        />
                        {isLocationsOpen && (
                          <div className={styles.dropdown}>
                            {filteredLocations.length === 0 ? (
                              <div className={styles.option}>Nenhum local encontrado</div>
                            ) : (
                              filteredLocations.slice(0, 10).map((local) => (
                                <div
                                  key={local.idOrigemDestino}
                                  className={styles.option}
                                  onClick={() => handleLocationSelect(local)}
                                >
                                  {local.localDeAtendimentoOrigemDestino}
                                  {local.cidadeOrigemDestino && (
                                    <span className="text-gray-400 ml-2">- {local.cidadeOrigemDestino}/{local.ufOrigemDestino}</span>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Se tem vínculo com o usuário logado e não foi solicitada troca
                      <div className={styles.linkedLocation}>
                        <div className={styles.locationInfo}>
                          {formData.enderecoNome}
                        </div>
                        <button 
                          type="button" 
                          className={styles.changeLocationButton}
                          onClick={handleChangeLocation}
                        >
                          Trocar local
                        </button>
                      </div>
                    )}
                    
                    {!hasLocationLink && !searchLocation && (
                      <div className={styles.infoText}>
                        Este prescritor não exige local de atendimento.
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="data">Data *</label>
                <div className={styles.dateInputContainer}>
                  <input
                    type="date"
                    className={styles.input}
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                    aria-label="Data da visita"
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
          </div>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Detalhes do Agendamento</h2>
            <div className={styles.formGroup}>
              <label htmlFor="descricao">Descrição</label>
              <textarea
                className={styles.textarea}
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Informe detalhes sobre a visita..."
                rows={5}
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
} 