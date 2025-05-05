export interface AgendaItem {
  id: number;
  cliente: string;
  data: string;
  hora: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  tipo: string;
  observacao?: string;
  telefone: string;
  endereco: string;
}

export interface FilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  statusFilter: 'all' | 'agendado' | 'confirmado' | 'cancelado' | 'concluido';
  dateFilter: string | null;
}

export function filterAgendaItems(
  items: AgendaItem[],
  filters: FilterState
): AgendaItem[] {
  return items.filter(item => {
    const matchesSearch = !filters.searchTerm || 
      item.cliente.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      item.telefone.includes(filters.searchTerm);

    const matchesStatus = filters.statusFilter === 'all' 
      ? true 
      : item.status === filters.statusFilter;

    const matchesDate = !filters.dateFilter || 
      item.data === filters.dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });
}

export function paginateItems(
  items: AgendaItem[],
  page: number,
  itemsPerPage: number
): AgendaItem[] {
  const startIndex = (page - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function getStatusColor(status: AgendaItem['status']): string {
  switch (status) {
    case 'agendado':
      return '#f59e0b'; // amarelo
    case 'confirmado':
      return '#10b981'; // verde
    case 'cancelado':
      return '#ef4444'; // vermelho
    case 'concluido':
      return '#3b82f6'; // azul
    default:
      return '#6b7280'; // cinza
  }
}

export function getStatusText(status: AgendaItem['status']): string {
  switch (status) {
    case 'agendado':
      return 'Agendado';
    case 'confirmado':
      return 'Confirmado';
    case 'cancelado':
      return 'Cancelado';
    case 'concluido':
      return 'Concluído';
    default:
      return 'Desconhecido';
  }
}
