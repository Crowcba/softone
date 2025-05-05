'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import styles from '@/components/ui/FormComponents.module.scss';

import {
  FormHeader,
  FormButton,
  FormError,
  FormSection,
  FormGrid,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormRadio,
  FormRadioGroup,
  FormInfo,
  FormLoading,
  FormSelectSearch,
  FormOption,
  FormDateInput
} from '@/components/ui/FormComponents';

import { getVisitTypes } from '@/utils/visitTypes';
import { getAgendaService } from '@/services/visits/service_agenda';
import { VisitasProfissional } from '@/services/visits/service_visits_prescribers';
import { visitsLocation } from '@/api/visits/visits_locations';
import { getVisitsService } from '@/services/visits/service_visits';
import { handleGetLinksByProfessionalId } from '@/services/visits/service_visits_prescribers_locations';

export default function RegisterVisitFormRefactored() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    idPrescritor: 0,
    prescritorNome: '',
    idEndereco: 0,
    enderecoNome: '',
    data: '',
    descricao: '',
    produto: 0,
    periodo: 0,
    tipo: 1,
    status: 4,
    ativo: true
  });
  
  // Estados para seleção de prescritor e local
  const [searchLocation, setSearchLocation] = useState('');
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [locais, setLocais] = useState<visitsLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<visitsLocation[]>([]);
  const [showChangeLocationOption, setShowChangeLocationOption] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [hasLocationLink, setHasLocationLink] = useState(false);
  const [isUserLinked, setIsUserLinked] = useState(false);
  
  // Tipos de visita
  const tiposVisita = getVisitTypes();
  
  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);
  
  // Filtrar locais ao digitar na busca
  useEffect(() => {
    if (searchLocation.trim() === '') {
      setFilteredLocations(locais);
    } else {
      const filtered = locais.filter(local => 
        local.localDeAtendimentoOrigemDestino.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchLocation, locais]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar locais
      const visitsService = await getVisitsService();
      const locations = await visitsService.getLocations();
      setLocais(locations);
      setFilteredLocations(locations);
      
      // Inicializar o formulário com a data atual
      setFormData(prev => ({
        ...prev,
        data: getTodayFormatted()
      }));
      
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setError('Falha ao carregar dados. Por favor, recarregue a página.');
    } finally {
      setLoading(false);
    }
  };
  
  // Formatar data para exibição
  const getTodayFormatted = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Validar vínculo com local
  const checkPrescriberLocation = async (prescriberId: number) => {
    setLoadingLocation(true);
    try {
      const links = await handleGetLinksByProfessionalId(prescriberId);
      
      if (links.length > 0) {
        setHasLocationLink(true);
        
        // Verificar se o primeiro vínculo é com o usuário logado
        const userId = Cookies.get('user_id');
        const userLink = links.find(link => link.idUsuario === userId);
        
        if (userLink) {
          setIsUserLinked(true);
          // Encontrar o local relacionado ao vínculo
          const location = locais.find(loc => loc.idOrigemDestino === userLink.idOrigemDestino);
          
          if (location) {
            setFormData(prev => ({
              ...prev,
              idEndereco: location.idOrigemDestino,
              enderecoNome: location.localDeAtendimentoOrigemDestino
            }));
          }
        } else {
          setIsUserLinked(false);
        }
      } else {
        setHasLocationLink(false);
        setIsUserLinked(false);
      }
    } catch (error) {
      console.error('Erro ao verificar vínculos de local:', error);
    } finally {
      setLoadingLocation(false);
    }
  };
  
  // Selecionar local
  const handleLocationSelect = (local: visitsLocation) => {
    setFormData(prev => ({
      ...prev,
      idEndereco: local.idOrigemDestino,
      enderecoNome: local.localDeAtendimentoOrigemDestino
    }));
    setSearchLocation(local.localDeAtendimentoOrigemDestino);
    setIsLocationsOpen(false);
  };
  
  // Selecionar prescritor
  const handlePrescriberSelect = async (prescritor: VisitasProfissional) => {
    setFormData(prev => ({
      ...prev,
      idPrescritor: prescritor.idProfissional,
      prescritorNome: prescritor.nomeProfissional
    }));
    
    await checkPrescriberLocation(prescritor.idProfissional);
  };
  
  // Permitir troca de local
  const handleChangeLocation = () => {
    setShowChangeLocationOption(true);
  };
  
  // Atualizar campo do formulário
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
      const [selectedYear, selectedMonth, selectedDay] = formData.data.split('-').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const currentDay = now.getDate();
      
      const selectedDateStr = `${selectedYear}${selectedMonth.toString().padStart(2, '0')}${selectedDay.toString().padStart(2, '0')}`;
      const currentDateStr = `${currentYear}${currentMonth.toString().padStart(2, '0')}${currentDay.toString().padStart(2, '0')}`;
      
      if (selectedDateStr < currentDateStr) {
        setError('Não é possível agendar para datas anteriores à atual.');
        setSubmitting(false);
        return;
      }
      
      const agendaService = await getAgendaService();
      const userId = Cookies.get('user_id');
      
      if (!userId) {
        setError('Usuário não identificado. Por favor, faça login novamente.');
        setSubmitting(false);
        return;
      }
      
      const data = {
        idPrescritor: formData.idPrescritor,
        idEndereco: formData.idEndereco || 0,
        idUsuario: userId,
        data: formData.data,
        descricao: formData.descricao,
        produto: formData.produto,
        periodo: formData.periodo,
        tipo: formData.tipo,
        status: formData.status,
        ativo: formData.ativo
      };
      
      try {
        // Criar novo agendamento
        await agendaService.createVisitaAgenda(data);
        toast.success('Agendamento criado com sucesso!');
        router.push('/mods/visits/agenda');
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
    <>
      <FormHeader title="Registro de Visita" actions={
        <FormButton variant="secondary" onClick={() => router.back()}>
          Voltar
        </FormButton>
      } />

      {error && <FormError>{error}</FormError>}
      <FormLoading visible={loading} />

      <form onSubmit={handleSubmit}>
        <FormSection title="Informações Básicas">
          <FormGrid cols={2}>
            <FormGroup>
              <FormLabel required>Data</FormLabel>
              <FormDateInput
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel required>Local de Atendimento</FormLabel>
              <FormSelectSearch
                name="endereco"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                options={filteredLocations.map(loc => loc.localDeAtendimentoOrigemDestino)}
                placeholder="Selecione ou busque um local"
              />
              {isLocationsOpen && (
                <div className={styles.optionsContainer}>
                  {filteredLocations.map((local) => (
                    <FormOption
                      key={local.idOrigemDestino}
                      value={local.idOrigemDestino.toString()}
                    >
                      {local.localDeAtendimentoOrigemDestino}
                    </FormOption>
                  ))}
                </div>
              )}
            </FormGroup>

            {hasLocationLink && !isUserLinked && (
              <FormInfo type="warning">
                Este profissional não está vinculado a este local. Deseja criar o vínculo?
              </FormInfo>
            )}

            <FormGroup>
              <FormLabel required>Tipo de Visita</FormLabel>
              <FormSelect
                name="tipo"
                value={formData.tipo.toString()}
                onChange={handleChange}
                required
              >
                {tiposVisita.map((tipo) => (
                  <FormOption
                    key={tipo.id}
                    value={tipo.id.toString()}
                  >
                    {tipo.name}
                  </FormOption>
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormLabel required>Período</FormLabel>
              <FormRadioGroup
                name="periodo"
                value={formData.periodo.toString()}
                onChange={(e) => handlePeriodoChange(parseInt(e.target.value))}
              >
                <FormRadio
                  label="Manhã"
                  value="1"
                  checked={formData.periodo === 1}
                />
                <FormRadio
                  label="Tarde"
                  value="2"
                  checked={formData.periodo === 2}
                />
                <FormRadio
                  label="Noite"
                  value="3"
                  checked={formData.periodo === 3}
                />
              </FormRadioGroup>
            </FormGroup>
          </FormGrid>
        </FormSection>
      </form>
    </>
  );
} 