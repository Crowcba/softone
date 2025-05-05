"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './table.module.css';
import { getAgendaService } from '@/services/visits/service_agenda';
import { VisitasAgendaDetalhada } from '@/api/visits/agenda';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getVisitasRotaService } from '@/services/visits/service_vista_rota';
import { fromLonLat, transformExtent } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import Modal from 'react-modal';
import { sincronizarAgendasPendentes } from '@/services/visits/service_visits_verification';
import Link from 'next/link';
import PendingAgendas from './PendingAgendas';

interface FilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  statusFilter: 'all' | 'agendado' | 'confirmado' | 'concluido' | 'finalizado' | 'cancelado' | 'inativo' | 'adiado' | 'pendentes';
  dateFilter: string | null;
}

// Interface para o formato dos dados armazenados
interface FormatoDadosOcorrencia {
  id: number;
  nome: string;
}

// Interface para os formatos de data
interface FormatosDatas {
  [key: string]: FormatoDadosOcorrencia[];
}

// Interface para os padrões de data
interface PadroesDatas {
  [key: number]: {
    valor: string;
    p1: string;
    p2: string;
    p3: string;
    formatoAmbiguo: boolean;
    interpretacaoDDMM: string;
    interpretacaoMMDD: string;
  };
}

// Interface para o modal de adiamento
interface AdiamentoModalState {
  isOpen: boolean;
  agendaId: number | null;
  novaData: string;
  periodo: number;
}

// Interface para o modal de inserção manual de KM
interface KmManualModalState {
  isOpen: boolean;
  agendaId: number | null;
  enderecoCompleto: string;
  km: string;
  userId: string;
}

declare global {
  interface Window {
    initMap: (() => void) | undefined;
  }
}

export default function AgendaPage() {
  const router = useRouter();
  const [items, setItems] = useState<VisitasAgendaDetalhada[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingButtons, setProcessingButtons] = useState<number[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 10,
    statusFilter: "pendentes",
    dateFilter: null
  });
  const [adiamentoModal, setAdiamentoModal] = useState<AdiamentoModalState>({
    isOpen: false,
    agendaId: null,
    novaData: '',
    periodo: 0
  });
  const [kmManualModal, setKmManualModal] = useState<KmManualModalState>({
    isOpen: false,
    agendaId: null,
    enderecoCompleto: '',
    km: '1.0',
    userId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<{success: number, failed: number} | null>(null);

  // Carregar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const agendaService = await getAgendaService();
        const userId = Cookies.get('user_id');
        
        if (!userId) {
          toast.error('Usuário não identificado');
          setItems([]);
          return;
        }
        // Usar o método que busca dados detalhados
        const data = await agendaService.getVisitasDetalhadasPorUsuario(userId);
        
        if (!data || data.length === 0) {
          setItems([]);
          return;
        }
        
        setItems(data);
        
      } catch (error) {
        console.error('Erro ao carregar agenda:', error);
        toast.error('Não foi possível carregar a agenda');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Sincronizar agendas pendentes ao carregar a página
    const syncPendingAgendas = async () => {
      try {
        const result = await sincronizarAgendasPendentes();
        if (result.success > 0 || result.failed > 0) {
          setSyncStats(result);
          
          if (result.success > 0) {
            toast.success(`${result.success} agendamento(s) pendente(s) sincronizado(s) com sucesso!`);
          }
          
          if (result.failed > 0) {
            toast.warn(`${result.failed} agendamento(s) não puderam ser sincronizados.`);
          }
        }
      } catch (error) {
        console.error('Erro ao sincronizar agendas pendentes:', error);
      }
    };
    
    syncPendingAgendas();
  }, []);

  // Função para carregar os dados da agenda
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Obter ID do usuário dos cookies
      const userId = localStorage.getItem('user_id') || Cookies.get('user_id');
      
      if (!userId) {
        setError('Usuário não identificado. Por favor, faça login novamente.');
        setIsLoading(false);
        return;
      }
      
      const agendaService = await getAgendaService();
      // Usar o novo método que busca dados detalhados
      const data = await agendaService.getVisitasDetalhadasPorUsuario(userId);
      
      console.log('Dados detalhados recebidos da API:', JSON.stringify(data, null, 2));
      
      if (!data || data.length === 0) {
        setItems([]);
        return;
      }
      
      // Normalizar os dados recebidos
      const normalizedData = data.map(item => ({
        ...item,
        // Garantir que va_status seja um número
        va_status: typeof item.va_status === 'number' ? item.va_status : 
                   (item as any).status ? Number((item as any).status) : 0
      }));
      
      console.log('Dados normalizados:', JSON.stringify(normalizedData, null, 2));
      
      setItems(normalizedData);
    } catch (error) {
      console.error('Erro ao carregar agendas:', error);
      setError('Erro ao carregar os dados. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Carregar dados da agenda quando o componente montar ou a sincronização mudar
    loadData();
  }, [syncStats]); // Recarregar dados quando sincronização for concluída

  // Filtrar e paginar itens
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Ordenar por data (da mais próxima para a mais distante)
    filtered.sort((a, b) => {
      if (!a.data || !b.data) return 0;
      
      // Converter as datas para objetos Date
      let dateA, dateB;
      
      // Para YYYY-MM-DD
      if (a.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateA = new Date(a.data);
      }
      // Para DD-MM-YYYY
      else if (a.data.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [diaA, mesA, anoA] = a.data.split('-');
        dateA = new Date(`${anoA}-${mesA}-${diaA}`);
      }
      else {
        dateA = new Date(a.data);
      }
      
      // Para YYYY-MM-DD
      if (b.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateB = new Date(b.data);
      }
      // Para DD-MM-YYYY
      else if (b.data.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [diaB, mesB, anoB] = b.data.split('-');
        dateB = new Date(`${anoB}-${mesB}-${diaB}`);
      }
      else {
        dateB = new Date(b.data);
      }
      
      return dateA.getTime() - dateB.getTime();
    });

    // Filtrar por termo de busca
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.nome_profissional || '').toLowerCase().includes(searchLower) ||
        (item.especialidade_profissional || '').toLowerCase().includes(searchLower) ||
        (item.telefone_origem_destino || '').includes(searchLower) ||
        (item.endereco_origem_destino || '').toLowerCase().includes(searchLower) ||
        (item.cidade_origem_destino || '').toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por status
    if (filters.statusFilter === 'pendentes') {
      // Mostrar apenas agendados (1) e confirmados (2)
      filtered = filtered.filter(item => item.va_status === 1 || item.va_status === 2);
    } else if (filters.statusFilter !== 'all') {
      const statusMap: Record<string, number> = {
        'agendado': 1,
        'confirmado': 2,
        'concluido': 3,
        'finalizado': 4,
        'cancelado': 5,
        'inativo': 6,
        'adiado': 7
      };
      
      const statusValue = statusMap[filters.statusFilter];
      
      if (statusValue) {
        filtered = filtered.filter(item => item.va_status === statusValue);
      }
    }

    // Filtrar por data
    if (filters.dateFilter) {
      filtered = filtered.filter(item => {
        if (!item.data) return false;
        
        // Converter a data do item para formato ISO
        let itemDate = item.data;
        
        // Se for DD-MM-YYYY, converter para YYYY-MM-DD
        if (item.data.match(/^\d{2}-\d{2}-\d{4}$/)) {
          const [dia, mes, ano] = item.data.split('-');
          itemDate = `${ano}-${mes}-${dia}`;
        }
        
        // Comparar com a data do filtro
        return itemDate === filters.dateFilter;
      });
    }

    // Paginar
    const startIndex = (filters.currentPage - 1) * filters.itemsPerPage;
    return filtered.slice(startIndex, startIndex + filters.itemsPerPage);
  }, [items, filters]);

  // Calcular total de páginas
  const totalPages = Math.ceil(
    items.length / filters.itemsPerPage
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value, currentPage: 1 }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, statusFilter: e.target.value as FilterState['statusFilter'], currentPage: 1 }));
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, dateFilter: e.target.value || null, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
  };

  const handleNewAgenda = () => {
    router.push('/mods/visits/agenda/register');
  };

  const handleEdit = (id: number) => {
    router.push(`/mods/visits/agenda/register?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        const agendaService = await getAgendaService();
        await agendaService.deleteVisitaAgenda(id);
        setItems(prev => prev.filter(item => item.id !== id));
        toast.success('Agendamento excluído com sucesso');
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        toast.error('Erro ao excluir agendamento');
      }
    }
  };

  const getStatusText = (va_status: number): string => {
    console.log('Status recebido:', va_status, typeof va_status);
    
    // Converter para número se for string ou usar 0 se for undefined/null
    const statusNum = va_status === undefined || va_status === null 
      ? 0 
      : (typeof va_status === 'string' ? parseInt(va_status) : va_status);
    
    switch (statusNum) {
      case 1: return 'Agendado';
      case 2: return 'Confirmado';
      case 3: return 'Concluído';
      case 4: return 'Finalizado';
      case 5: return 'Cancelado';
      case 6: return 'Inativo';
      case 7: return 'Adiado';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (va_status: number): string => {
    // Converter para número se for string ou usar 0 se for undefined/null
    const statusNum = va_status === undefined || va_status === null 
      ? 0 
      : (typeof va_status === 'string' ? parseInt(va_status) : va_status);
    
    switch (statusNum) {
      case 1: return '#f59e0b'; // amarelo - agendado
      case 2: return '#10b981'; // verde - confirmado
      case 3: return '#3b82f6'; // azul - concluido
      case 4: return '#6366f1'; // indigo - finalizado
      case 5: return '#ef4444'; // vermelho - cancelado
      case 6: return '#6b7280'; // cinza - inativo
      case 7: return '#f97316'; // laranja - adiado
      default: return '#6b7280'; // cinza - desconhecido
    }
  };

  const handleOpenMaps = (endereco: string, cidade: string, uf: string) => {
    const query = encodeURIComponent(`${endereco}, ${cidade}, ${uf}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  const handleOpenWaze = (endereco: string, cidade: string, uf: string) => {
    const query = encodeURIComponent(`${endereco}, ${cidade}, ${uf}`);
    window.open(`https://www.waze.com/ul?q=${query}&navigate=yes`, '_blank');
  };

  const handleCall = (telefone: string) => {
    if (telefone) {
      window.open(`tel:${telefone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const isSameDay = (dateStr: string): boolean => {
    if (!dateStr) return false;
    
    try {
      // Verificar formato da data recebida
      let ano, mes, dia;
      
      // Formato YYYY-MM-DD (vindo da API)
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        [ano, mes, dia] = dateStr.split('-').map(Number);
      } 
      // Formato DD-MM-YYYY
      else if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
        [dia, mes, ano] = dateStr.split('-').map(Number);
      }
      else {
        console.error('Formato de data não reconhecido:', dateStr);
        return false;
      }
      
      // Verificar se a data é válida
      if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        console.error('Formato de data inválido:', dateStr);
        return false;
      }
      
      // Criar objeto Date corretamente (mês é 0-indexed)
      const data = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      
      // Garantir que o ano, mês e dia sejam corretos na data criada
      if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
        console.error('Data inválida após conversão:', dateStr, '->', data);
        return false;
      }
      
      console.log('Comparando datas:', {
        dataAgendamento: `${dia}/${mes}/${ano}`,
        hoje: `${hoje.getDate()}/${hoje.getMonth() + 1}/${hoje.getFullYear()}`
      });
    
      return data.getDate() === hoje.getDate() &&
             data.getMonth() === hoje.getMonth() &&
             data.getFullYear() === hoje.getFullYear();
    } catch (error) {
      console.error('Erro ao comparar datas:', error);
      return false;
    }
  };

  const handleNavigate = (endereco: string, cidade: string, uf: string) => {
    const query = encodeURIComponent(`${endereco}, ${cidade}, ${uf}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`, '_blank');
  };

  const calculateDistanceWithOpenLayers = async (
    originLat: number,
    originLng: number,
    destinationAddress: string
  ): Promise<number> => {
    try {
      console.log('Calculando distância para:', destinationAddress);
      console.log('Origem:', { lat: originLat, lng: originLng });
      
      // Precisamos converter o endereço em coordenadas usando um serviço de geocodificação
      // Vamos usar a Nominatim API (OpenStreetMap) que é gratuita e não requer chave
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destinationAddress)}&format=json&limit=1`;
      
      console.log('URL de geocodificação:', geocodeUrl);
      
      const response = await fetch(geocodeUrl, {
        headers: {
          'User-Agent': 'SoftOne Agenda App' // Importante fornecer User-Agent para Nominatim
        }
      });
      
      if (!response.ok) {
        throw new Error(`Falha ao geocodificar endereço. Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Resposta da geocodificação:', data);
      
      if (!data || data.length === 0) {
        throw new Error('Endereço não encontrado pelo serviço de geocodificação');
      }
      
      // Obter coordenadas do destino
      const destLat = parseFloat(data[0].lat);
      const destLng = parseFloat(data[0].lon);
      const displayName = data[0].display_name;
      
      if (isNaN(destLat) || isNaN(destLng)) {
        throw new Error('Coordenadas inválidas retornadas pelo serviço de geocodificação');
      }
      
      console.log('Endereço encontrado:', displayName);
      console.log('Coordenadas do destino:', { lat: destLat, lng: destLng });
      
      // Verificar se o endereço geocodificado parece correto
      const originalParts = destinationAddress.toLowerCase().split(/,\s*/);
      const foundParts = displayName.toLowerCase().split(/,\s*/);
      
      let matchScore = 0;
      originalParts.forEach(part => {
        if (foundParts.some((foundPart: string) => foundPart.includes(part))) {
          matchScore++;
        }
      });
      
      const matchPercentage = (matchScore / originalParts.length) * 100;
      console.log(`Taxa de correspondência do endereço: ${matchPercentage.toFixed(2)}%`);
      
      if (matchPercentage < 50) {
        console.warn('O endereço encontrado pode não corresponder ao endereço solicitado!');
        toast.warning(`Endereço pode não ser preciso. Encontrado: ${displayName}`, {
          autoClose: 5000
        });
      }
      
      // Calcular distância geodésica (linha reta) usando OpenLayers
      const distance = getDistance(
        [originLng, originLat],
        [destLng, destLat]
      );
      
      // Converter de metros para km e aplicar fator de correção para estimar distância por estrada
      // Geralmente, a distância por estrada é entre 1.3 e 1.5 vezes a distância em linha reta
      const distanceInKm = (distance / 1000) * 1.4;
      
      console.log(`Origem: (${originLat}, ${originLng})`);
      console.log(`Destino: (${destLat}, ${destLng})`);
      console.log(`Distância em linha reta: ${(distance / 1000).toFixed(2)} km`);
      console.log(`Distância estimada por estrada: ${distanceInKm.toFixed(2)} km`);
      
      // Mostrar informações mais detalhadas no toast
      toast.info(
        `Endereço encontrado: ${displayName.substr(0, 50)}...`, 
        { autoClose: 3000 }
      );
      
      return distanceInKm;
    } catch (error) {
      console.error('Erro ao calcular distância com OpenLayers:', error);
      throw error;
    }
  };

  // Função para estimar a localização atual baseada no IP (sem necessidade de permissões)
  const getLocationFromIP = async (): Promise<{lat: number, lng: number}> => {
    try {
      // Usar o serviço gratuito ipapi.co para obter localização aproximada
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      console.log('Localização baseada em IP:', data);
      
      if (!data.latitude || !data.longitude) {
        throw new Error('Dados de localização incompletos');
      }
      
      return {
        lat: data.latitude,
        lng: data.longitude
      };
    } catch (error) {
      console.error('Erro ao obter localização por IP:', error);
      // Usar uma localização default para o Brasil (centro de São Paulo)
      return {
        lat: -23.5505,
        lng: -46.6333
      };
    }
  };

  // Função para verificar se já existe uma rota registrada para este agendamento
  const checkExistingRoute = async (agendaId: number): Promise<boolean> => {
    try {
      const rotaService = getVisitasRotaService();
      // Buscar rotas existentes para este agendaId
      const rotas = await rotaService.getRotasByAgendaId(agendaId);
      
      if (rotas && rotas.length > 0) {
        console.log(`Rota(s) existente(s) encontrada(s) para o agendamento ${agendaId}:`, rotas);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao verificar rotas existentes:', error);
      return false; // Em caso de erro, assume que não existe e permite criar
    }
  };
  
  // Função para apenas navegar para o endereço sem registrar rota
  const navigateToAddress = (enderecoCompleto: string) => {
    const query = encodeURIComponent(enderecoCompleto);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`, '_blank');
  };

  const handleGoClick = async (
    agendaId: number,
    enderecoDestino: string,
    cidadeDestino: string,
    ufDestino: string
  ) => {
    // Verificar se já está processando
    if (processingButtons.includes(agendaId)) {
      return;
    }
    
    // Marcar como processando
    setProcessingButtons(prev => [...prev, agendaId]);
    
    try {
      // Endereço completo para navegação
      const enderecoCompleto = `${enderecoDestino}, ${cidadeDestino}, ${ufDestino}`;
      
      // Pegar o item da agenda para usar seus dados
      const agendaItem = items.find(item => item.id === agendaId);
      if (!agendaItem) {
        toast.error('Agendamento não encontrado');
        setProcessingButtons(prev => prev.filter(id => id !== agendaId));
        return;
      }
      
      const userId = Cookies.get('user_id');
      if (!userId) {
        toast.error('Usuário não identificado');
        setProcessingButtons(prev => prev.filter(id => id !== agendaId));
        return;
      }
      
      // Verificar se já existe uma rota para este agendamento
      let rotaExistente = false;
      try {
        const rotaService = getVisitasRotaService();
        const rotasExistentes = await rotaService.getRotasByAgendaId(agendaId);
        
        if (rotasExistentes && rotasExistentes.length > 0) {
          // Já existem rotas para este agendamento
          rotaExistente = true;
          console.log(`Rotas existentes para agendamento ${agendaId}:`, rotasExistentes);
          
          // Se o status for "agendado", mudar para "confirmado" automaticamente
          if (agendaItem.va_status === 1) {
            await handleStatusChange(agendaId, 2, agendaItem); // 2 = confirmado
            toast.success('Status atualizado para Confirmado');
          }
          
          toast.warning(
            'Já existe uma rota registrada para este agendamento.',
            {
              autoClose: 5000,
              closeButton: true
            }
          );
          
          // Perguntar se deseja apenas navegar
          const continuarNavegacao = window.confirm(
            'Já existe uma rota registrada para este agendamento. Deseja apenas navegar sem registrar novamente?'
          );
          
          if (continuarNavegacao) {
            navigateToAddress(enderecoCompleto);
          }
          
          setProcessingButtons(prev => prev.filter(id => id !== agendaId));
          return;
        }
      } catch (checkError) {
        console.error('Erro ao verificar rotas existentes:', checkError);
        // Continuar mesmo se houver erro na verificação
      }
      
      // Se não existe rota, criar uma nova
      toast.info('Calculando distância e registrando rota...');
      
      try {
        // Primeiro tentar obter geolocalização do navegador
        let latitude, longitude;
        
        try {
          // Configurar um timeout para a promessa de geolocalização
          const positionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error('Geolocalização não suportada neste navegador'));
              return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
          });
          
          // Adicionar um timeout para a promessa
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao esperar permissão de geolocalização')), 5000);
          });
          
          // Usar Promise.race para aceitar o que vier primeiro
          const position = await Promise.race([positionPromise, timeoutPromise]);
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          console.log('Usando geolocalização do navegador:', { latitude, longitude });
        } catch (geoError) {
          console.error('Geolocalização do navegador falhou:', geoError);
          toast.warning('Usando localização aproximada baseada no IP');
          
          // Usar localização baseada em IP como fallback
          const ipLocation = await getLocationFromIP();
          latitude = ipLocation.lat;
          longitude = ipLocation.lng;
          console.log('Usando geolocalização por IP:', { latitude, longitude });
        }
        
        let km;
        try {
          // Usar OpenLayers para calcular a distância
          km = await calculateDistanceWithOpenLayers(latitude, longitude, enderecoCompleto);
          toast.success(`Distância calculada: ${km.toFixed(2)} km`);
        } catch (distanceError) {
          console.error('Erro ao calcular distância com OpenLayers:', distanceError);
          toast.warning('Não foi possível calcular a distância automaticamente. Por favor, insira manualmente.');
          
          // Abrir modal para inserção manual de KM
          setKmManualModal({
            isOpen: true,
            agendaId: agendaId,
            enderecoCompleto: enderecoCompleto,
            km: '1.0',
            userId: userId
          });
          
          setProcessingButtons(prev => prev.filter(id => id !== agendaId));
          return;
        }
        
        // Registrar a rota
        await registrarRota(agendaId, agendaItem, enderecoCompleto, userId, km);
        
      } catch (error) {
        console.error('Erro geral ao processar rota:', error);
        
        // Abrir modal para inserção manual de KM
        toast.warning('Ocorreu um erro. Por favor, insira a distância manualmente.');
        setKmManualModal({
          isOpen: true,
          agendaId: agendaId,
          enderecoCompleto: enderecoCompleto,
          km: '1.0',
          userId: userId
        });
      }
    } catch (error) {
      console.error('Erro ao iniciar rota:', error);
      toast.error('Erro ao iniciar rota');
    } finally {
      // Remover da lista de processamento quando concluir
      setProcessingButtons(prev => prev.filter(id => id !== agendaId));
    }
  };
  
  // Função para registrar a rota com o KM fornecido
  const registrarRota = async (
    agendaId: number,
    agendaItem: VisitasAgendaDetalhada,
    enderecoCompleto: string,
    userId: string,
    km: number
  ) => {
    try {
      // Registrar a rota
      const rotaService = getVisitasRotaService();
      const dataHora = new Date().toISOString().split('.')[0];
      
      const novaRota = {
        idOrigem: agendaItem.id_endereco || 0,
        idDestino: agendaItem.id_endereco || 0,
        km: km,
        data: dataHora,
        idUsuario: userId,
        ativo: true,
        idAgenda: agendaId
      };
      
      console.log('Enviando para API:', novaRota);
      await rotaService.createRota(novaRota);
      toast.success('Rota iniciada com sucesso!');
      
      // Se o status for "agendado", mudar para "confirmado" automaticamente
      if (agendaItem.va_status === 1) {
        await handleStatusChange(agendaId, 2, agendaItem); // 2 = confirmado
        toast.success('Status atualizado para Confirmado');
      }
      
      // Abrir Google Maps para navegação
      const query = encodeURIComponent(enderecoCompleto);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`, '_blank');
      
      return true;
    } catch (error) {
      console.error('Erro ao registrar rota:', error);
      toast.error('Erro ao registrar rota');
      return false;
    }
  };
  
  // Função para lidar com a submissão do KM manual
  const handleSalvarKmManual = async () => {
    try {
      if (!kmManualModal.agendaId) {
        toast.error('ID de agendamento inválido');
        return;
      }
      
      // Validar o valor de KM
      const km = parseFloat(kmManualModal.km);
      if (isNaN(km) || km <= 0) {
        toast.error('Por favor, insira um valor válido para a distância');
        return;
      }
      
      // Buscar o item da agenda
      const agendaItem = items.find(item => item.id === kmManualModal.agendaId);
      if (!agendaItem) {
        toast.error('Agendamento não encontrado');
        return;
      }
      
      // Registrar a rota com o KM fornecido manualmente
      const sucesso = await registrarRota(
        kmManualModal.agendaId, 
        agendaItem, 
        kmManualModal.enderecoCompleto, 
        kmManualModal.userId, 
        km
      );
      
      if (sucesso) {
        // Fechar o modal
        setKmManualModal(prev => ({ ...prev, isOpen: false }));
      }
    } catch (error) {
      console.error('Erro ao salvar KM manual:', error);
      toast.error('Erro ao registrar rota com KM manual');
    }
  };

  // Funções para manipular o status de visitas confirmadas
  const handleStatusChange = async (id: number, newStatus: number, item: VisitasAgendaDetalhada) => {
    try {
      const agendaService = await getAgendaService();
      
      // Garantir que data seja sempre uma string no formato esperado pela API (YYYY-MM-DD)
      const dataFormatada = item.data || '';
      
      await agendaService.updateVisitaAgenda(id, {
        id: id,
        idPrescritor: item.id_prescritor,
        idEndereco: item.id_endereco,
        idUsuario: item.id_usuario,
        data: dataFormatada,
        status: newStatus,
        descricao: item.descricao,
        produto: item.produto,
        ativo: item.ativo,
        periodo: item.periodo,
        tipo: item.tipo
      });
      
      // Atualizar o item na lista
      setItems(prev => prev.map(i => 
        i.id === id 
          ? { ...i, va_status: newStatus } 
          : i
      ));
      
      toast.success(`Status atualizado para ${getStatusText(newStatus)}`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleCancelar = async (id: number, item: VisitasAgendaDetalhada) => {
    if (window.confirm('Tem certeza que deseja cancelar esta visita?')) {
      await handleStatusChange(id, 5, item); // 5 = cancelado
    }
  };

  const handleAdiar = (id: number, item: VisitasAgendaDetalhada) => {
    // Configurar o estado do modal
    const dataAtual = item.data ? item.data : new Date().toISOString().split('T')[0].split('-').reverse().join('-');
    setAdiamentoModal({
      isOpen: true,
      agendaId: id,
      novaData: dataAtual,
      periodo: item.periodo || 0
    });
  };

  const handleSalvarAdiamento = async () => {
    try {
      if (!adiamentoModal.agendaId || !adiamentoModal.novaData) {
        toast.error('Dados de adiamento inválidos');
        return;
      }

      const item = items.find(i => i.id === adiamentoModal.agendaId);
      if (!item) {
        toast.error('Agendamento não encontrado');
        return;
      }

      const agendaService = await getAgendaService();
      
      // Formatar a data no formato esperado pela API (YYYY-MM-DD)
      let dataFormatada = adiamentoModal.novaData;
      
      // Se estiver no formato DD-MM-YYYY, converter para YYYY-MM-DD
      if (dataFormatada.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [dia, mes, ano] = dataFormatada.split('-');
        dataFormatada = `${ano}-${mes}-${dia}`;
      }
      
      await agendaService.updateVisitaAgenda(adiamentoModal.agendaId, {
        id: adiamentoModal.agendaId,
        idPrescritor: item.id_prescritor,
        idEndereco: item.id_endereco,
        idUsuario: item.id_usuario,
        data: dataFormatada,
        status: 1, // Volta para agendado
        descricao: item.descricao,
        produto: item.produto,
        ativo: item.ativo,
        periodo: adiamentoModal.periodo,
        tipo: item.tipo
      });
      
      // Atualizar o item na lista
      setItems(prev => prev.map(i => 
        i.id === adiamentoModal.agendaId 
          ? { 
              ...i, 
              va_status: 1, // agendado
              data: dataFormatada,
              periodo: adiamentoModal.periodo
            } 
          : i
      ));
      
      // Fechar o modal
      setAdiamentoModal(prev => ({ ...prev, isOpen: false }));
      toast.success('Visita adiada com sucesso');
    } catch (error) {
      console.error('Erro ao adiar visita:', error);
      toast.error('Erro ao adiar visita');
    }
  };

  const handleConcluir = async (id: number, item: VisitasAgendaDetalhada) => {
    try {
      setProcessingButtons(prev => [...prev, id]);
      
      // Verificar proximidade do local da visita
      let latitude, longitude;
      let distanciaProximo = false;
      
      try {
        // Obter coordenadas atuais
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });
        
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        
        // Calcular distância até o local da visita
        const enderecoCompleto = `${item.endereco_origem_destino}, ${item.cidade_origem_destino}, ${item.uf_origem_destino}`;
        const distancia = await calculateDistanceWithOpenLayers(latitude, longitude, enderecoCompleto);
        
        // Converter km para metros
        const distanciaMetros = distancia * 1000;
        console.log(`Distância até o local da visita: ${distanciaMetros.toFixed(2)} metros`);
        
        // Verificar se está próximo (menos de 500 metros)
        distanciaProximo = distanciaMetros < 500;
        
        if (distanciaProximo) {
          // Se está próximo, concluir diretamente
          await handleStatusChange(id, 3, item); // 3 = concluído
          toast.success('Visita concluída com sucesso!');
        } else {
          // Se não está próximo, pedir confirmação
          const confirmarMesmoAssim = window.confirm(
            `Você está a mais de 500 metros do local da visita (${distanciaMetros.toFixed(0)} metros). Deseja concluir mesmo assim?`
          );
          
          if (confirmarMesmoAssim) {
            await handleStatusChange(id, 3, item); // 3 = concluído
            toast.info('Visita concluída mesmo estando distante do local');
          } else {
            toast.info('Operação cancelada pelo usuário');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar proximidade:', error);
        
        // Se houver erro na verificação, perguntar se quer continuar
        const confirmarMesmoAssim = window.confirm(
          'Não foi possível verificar sua localização. Deseja concluir a visita mesmo assim?'
        );
        
        if (confirmarMesmoAssim) {
          await handleStatusChange(id, 3, item); // 3 = concluído
          toast.info('Visita concluída sem verificação de localização');
        } else {
          toast.info('Operação cancelada');
        }
      } finally {
        setProcessingButtons(prev => prev.filter(btnId => btnId !== id));
      }
    } catch (error) {
      console.error('Erro geral ao concluir visita:', error);
      toast.error('Erro ao concluir visita');
      setProcessingButtons(prev => prev.filter(btnId => btnId !== id));
    }
  };

  const handleFinalizar = async (id: number, item: VisitasAgendaDetalhada) => {
    if (window.confirm('Tem certeza que deseja finalizar esta visita?')) {
      await handleStatusChange(id, 4, item); // 4 = finalizado
    }
  };

  const refresh = () => {
    // Forçar recarga dos dados
    setIsLoading(true);
    setError(null);
    loadData();
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Agenda de Visitas</h1>
        <div className={styles.headerButtons}>
          <Link href="/mods/visits/agenda/register" className={styles.newButton}>
            <span className={styles.buttonIcon}>+</span> Nova Visita
          </Link>
          <Link href="/mods/visits/agenda/from-list" className={styles.listButton}>
            <span className={styles.buttonIcon}>+</span> Agenda por Lista
          </Link>
        </div>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {/* Componente de agendas pendentes */}
      <PendingAgendas onSync={refresh} />
      
      {/* Filtros de busca */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar por profissional ou telefone"
          className={styles.searchInput}
          value={filters.searchTerm}
          onChange={handleSearch}
        />
        
        <select 
          className={styles.filterSelect}
          value={filters.statusFilter}
          onChange={handleStatusFilter}
        >
          <option value="pendentes">Pendentes</option>
          <option value="all">Todos os status</option>
          <option value="agendado">Agendado</option>
          <option value="confirmado">Confirmado</option>
          <option value="concluido">Concluído</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
          <option value="inativo">Inativo</option>
          <option value="adiado">Adiado</option>
        </select>
        
        <input
          type="date"
          className={styles.dateInput}
          value={filters.dateFilter || ''}
          onChange={handleDateFilter}
        />
      </div>
      
      <main>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando...</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Profissional</th>
                  <th className={styles.tableHeaderCell}>Data</th>
                  <th className={styles.tableHeaderCell}>Local</th>
                  <th className={styles.tableHeaderCell}>Telefone</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td className={styles.tableCell} colSpan={6} style={{textAlign: 'center'}}>
                      Agenda não localizada
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    // Formatar a data para exibição (DD/MM/YYYY)
                    let formattedDate = 'Data não definida';
                    
                    if (item.data) {
                      // Verificar o formato da data (YYYY-MM-DD ou DD-MM-YYYY)
                      let dia, mes, ano;
                      
                      // Formato YYYY-MM-DD
                      if (item.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        [ano, mes, dia] = item.data.split('-').map(Number);
                        formattedDate = `${dia}/${mes}/${ano}`;
                      } 
                      // Formato DD-MM-YYYY
                      else if (item.data.match(/^\d{2}-\d{2}-\d{4}$/)) {
                        [dia, mes, ano] = item.data.split('-').map(Number);
                        formattedDate = `${dia}/${mes}/${ano}`;
                      }
                      else {
                        // Tentar criar um objeto Date e formatá-lo
                        try {
                          const date = new Date(item.data);
                          if (!isNaN(date.getTime())) {
                            formattedDate = date.toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric' 
                            });
                          }
                        } catch (e) {
                          console.error('Erro ao formatar data:', item.data, e);
                        }
                      }
                    }
                    
                    const isToday = isSameDay(item.data || '');
                    const isConfirmado = item.va_status === 2; // Status confirmado

                    return (
                      <tr key={item.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          {item.nome_profissional || 'Nome não disponível'}
                          <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>
                            {item.especialidade_profissional || 'Especialidade não disponível'}
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          {formattedDate}
                          <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>
                            {item.periodo === 0 ? 'Manhã' : 
                             item.periodo === 1 ? 'Tarde' : 
                             item.periodo === 2 ? 'Integral' : 'Não definido'}
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.locationContainer}>
                            <div className={styles.locationText}>
                              {item.endereco_origem_destino || 'Endereço não disponível'}
                              <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>
                                {(item.cidade_origem_destino && item.uf_origem_destino) ? 
                                  `${item.cidade_origem_destino}/${item.uf_origem_destino}` : 
                                  'Localização não disponível'}
                              </div>
                            </div>
                            <div className={styles.locationActions}>
                              {isToday && (
                                <button
                                  className={styles.goButton}
                                  onClick={() => handleGoClick(
                                    item.id,
                                    item.endereco_origem_destino || '',
                                    item.cidade_origem_destino || '',
                                    item.uf_origem_destino || ''
                                  )}
                                  title="Iniciar navegação"
                                  disabled={processingButtons.includes(item.id) || !item.endereco_origem_destino}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                  </svg>
                                  <span>Ir</span>
                                </button>
                              )}
                              {(item.endereco_origem_destino && item.cidade_origem_destino && item.uf_origem_destino) && (
                                <>
                                  <button
                                    className={styles.iconButton}
                                    onClick={() => handleOpenMaps(
                                      item.endereco_origem_destino || '',
                                      item.cidade_origem_destino || '',
                                      item.uf_origem_destino || ''
                                    )}
                                    title="Abrir no Google Maps"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                                      <line x1="9" y1="3" x2="9" y2="18"></line>
                                      <line x1="15" y1="6" x2="15" y2="21"></line>
                                    </svg>
                                  </button>
                                  <button 
                                    className={styles.iconButton}
                                    onClick={() => handleOpenWaze(
                                      item.endereco_origem_destino || '',
                                      item.cidade_origem_destino || '',
                                      item.uf_origem_destino || ''
                                    )}
                                    title="Abrir no Waze"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line x1="2" y1="12" x2="22" y2="12"></line>
                                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          {item.telefone_origem_destino ? (
                            <div className={styles.whatsappContainer}>
                              <div className={styles.whatsappNumber}>
                                {item.telefone_origem_destino}
                                <button
                                  className={styles.iconButton}
                                  onClick={() => handleCall(item.telefone_origem_destino || '')}
                                  title="Ligar"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className={styles.emptyCell}>Não disponível</span>
                          )}
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.statusBadge} style={{
                            backgroundColor: getStatusColor(item.va_status),
                          }}>
                            {getStatusText(item.va_status)}
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.actionsContainer}>
                            {/* Botões de edição e exclusão para todos os status */}
                            <button
                              className={styles.iconButton}
                              onClick={() => handleEdit(item.id)}
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              className={styles.iconButton}
                              onClick={() => handleDelete(item.id)}
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                            
                            {/* Para status Desconhecido (0 ou outros valores não mapeados), mostrar um botão para confirmar */}
                            {(!item.va_status || item.va_status < 1 || item.va_status > 7) && (
                              <button
                                className={styles.actionButton}
                                onClick={() => handleStatusChange(item.id, 1, item)} 
                                title="Definir como Agendado"
                                disabled={processingButtons.includes(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 2v10"></path>
                                  <line x1="16" y1="6" x2="8" y2="6"></line>
                                  <path d="M22 11v6a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-6"></path>
                                </svg>
                              </button>
                            )}
                            
                            {/* Botões condicionais para visitas com status específicos */}
                            {item.va_status === 1 && (
                              <button
                                className={styles.actionButton}
                                onClick={() => handleStatusChange(item.id, 2, item)} // Confirmar
                                title="Confirmar visita"
                                disabled={processingButtons.includes(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                              </button>
                            )}
                            
                            {item.va_status === 2 && (
                              <>
                                <button
                                  className={styles.actionButton}
                                  onClick={() => handleConcluir(item.id, item)}
                                  title="Concluir"
                                  disabled={processingButtons.includes(item.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5"></path>
                                  </svg>
                                </button>
                                <button
                                  className={styles.actionButton}
                                  onClick={() => handleCancelar(item.id, item)}
                                  title="Cancelar"
                                  disabled={processingButtons.includes(item.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                                <button
                                  className={styles.actionButton}
                                  onClick={() => handleAdiar(item.id, item)}
                                  title="Adiar"
                                  disabled={processingButtons.includes(item.id)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                </button>
                              </>
                            )}
                            
                            {item.va_status === 3 && (
                              <button
                                className={styles.actionButton}
                                onClick={() => handleFinalizar(item.id, item)}
                                title="Finalizar"
                                disabled={processingButtons.includes(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <button 
                  className={styles.paginationButton}
                  onClick={() => handlePageChange(Math.max(filters.currentPage - 1, 1))}
                  disabled={filters.currentPage === 1}
                >
                  &laquo; Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    onClick={() => handlePageChange(page)}
                    className={`${styles.paginationButton} ${filters.currentPage === page ? styles.paginationActive : ''}`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  className={styles.paginationButton}
                  onClick={() => handlePageChange(Math.min(filters.currentPage + 1, totalPages))}
                  disabled={filters.currentPage === totalPages}
                >
                  Próximo &raquo;
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal para adiamento */}
      <Modal
        isOpen={adiamentoModal.isOpen}
        onRequestClose={() => setAdiamentoModal(prev => ({ ...prev, isOpen: false }))}
        contentLabel="Adiar Visita"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <h2>Adiar Visita</h2>
          <div className={styles.modalForm}>
            <div className={styles.formGroup}>
              <label htmlFor="novaData">Nova Data:</label>
              <input
                type="date"
                id="novaData"
                value={adiamentoModal.novaData}
                onChange={(e) => setAdiamentoModal(prev => ({ ...prev, novaData: e.target.value }))}
                className={styles.modalInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="periodo">Período:</label>
              <select
                id="periodo"
                value={adiamentoModal.periodo}
                onChange={(e) => setAdiamentoModal(prev => ({ ...prev, periodo: Number(e.target.value) }))}
                className={styles.modalInput}
              >
                <option value={0}>Manhã</option>
                <option value={1}>Tarde</option>
                <option value={2}>Integral</option>
              </select>
            </div>
            <div className={styles.modalButtons}>
              <button 
                onClick={handleSalvarAdiamento}
                className={styles.saveButton}
              >
                Salvar
              </button>
              <button 
                onClick={() => setAdiamentoModal(prev => ({ ...prev, isOpen: false }))}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal para inserção manual de KM */}
      <Modal
        isOpen={kmManualModal.isOpen}
        onRequestClose={() => setKmManualModal(prev => ({ ...prev, isOpen: false }))}
        contentLabel="Inserir Quilometragem"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <div className={styles.modalContent}>
          <h2>Inserir Quilometragem</h2>
          <div className={styles.modalForm}>
            <div className={styles.formGroup}>
              <label htmlFor="kmManual">Distância (KM):</label>
              <input
                type="number"
                id="kmManual"
                value={kmManualModal.km}
                onChange={(e) => setKmManualModal(prev => ({ ...prev, km: e.target.value }))}
                className={styles.modalInput}
                min="0.1"
                step="0.1"
              />
            </div>
            <div className={styles.modalText}>
              <p>Endereço: {kmManualModal.enderecoCompleto}</p>
            </div>
            <div className={styles.modalButtons}>
              <button 
                onClick={handleSalvarKmManual}
                className={styles.saveButton}
              >
                Confirmar e Iniciar Rota
              </button>
              <button 
                onClick={() => setKmManualModal(prev => ({ ...prev, isOpen: false }))}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
