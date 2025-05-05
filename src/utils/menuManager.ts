import Cookies from 'js-cookie';

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  subItems?: MenuItem[];
}

export interface ModuloAtivo {
  id: string;
  id_modulo: string;
  nome: string;
  status: boolean;
}

// Lista completa de itens do menu
export const menuItems: MenuItem[] = [
  { id: 'home', name: 'Home ', path: '/home' },
  { id: 'bomba', name: 'Bomba (Em breve)', path: '/em_construcao' },
  { id: 'boleto', name: 'Boleto (Em breve)', path: '/em_construcao' },
  { id: 'compras', name: 'Compras (Em breve)', path: '/em_construcao' },
  { id: 'estoque', name: 'Estoque (Em breve)', path: '/em_construcao' },
  { id: 'faturamento', name: 'Faturamento (Em breve)', path: '/em_construcao' },
  { id: 'financeiro', name: 'Financeiro (Em breve)', path: '/em_construcao' },
  { id: 'licitacao', name: 'Licitação (Em breve)', path: '/em_construcao' },
  { id: 'marketing', name: 'Marketing (Em breve)', path: '/em_construcao' },
  { id: 'produtora', name: 'Produção (Em breve)', path: '/em_construcao' },
  { id: 'relatorios', name: 'Relatórios (Em breve)', path: '/em_construcao' },
  { id: 'rh', name: 'RH (Em breve)', path: '/em_construcao' },
  { id: 'vendas', name: 'Vendas (Em breve)', path: '/em_construcao' },
  { id: 'visits', name: 'Visitas', path: '/visitas' },
  { id: 'configuracao', name: 'Configuração (Em breve)', path: '/em_construcao' },
];

// Função para obter os módulos ativos dos cookies
export const getModulosAtivos = (): ModuloAtivo[] => {
  try {
    const modulosAtivosStr = Cookies.get('modulos_ativos');
    if (modulosAtivosStr) {
      return JSON.parse(modulosAtivosStr);
    }
    return [];
  } catch (error) {
    return [];
  }
};

// Função para normalizar o nome do módulo
const normalizeModuleName = (name: string): string => {
  return name
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^A-Z0-9]/g, ''); // Remove caracteres especiais
};

// Função para verificar se um módulo está ativo
export const isModuloAtivo = (moduloId: string): boolean => {
  const modulosAtivos = getModulosAtivos();
  const normalizedModuloId = normalizeModuleName(moduloId);
  
  return modulosAtivos.some(modulo => {
    const moduloNome = normalizeModuleName(modulo.nome);
    return moduloNome === normalizedModuloId && modulo.status === true;
  });
};

// Função para obter os itens do menu filtrados por permissão
export const getMenuItems = (): MenuItem[] => {
  try {
    const modulosAtivos = getModulosAtivos();
    
    // Se não houver módulos ativos, retorna apenas HOME e VISITAS
    if (!modulosAtivos.length) {
      return menuItems.filter(item => item.id === 'home' || item.id === 'visits');
    }
    
    // Filtra os itens do menu baseado nos módulos ativos
    return menuItems.filter(item => {
      // Se o item for 'home' ou 'visits', sempre mostrar
      if (item.id === 'home' || item.id === 'visits') {
        return true;
      }
      
      // Para outros itens, verificar se existe nos módulos ativos
      return isModuloAtivo(item.id);
    });
  } catch (error) {
    // Em caso de erro, retorna apenas HOME e VISITAS
    return menuItems.filter(item => item.id === 'home' || item.id === 'visits');
  }
};

// Função para obter o nome do módulo
export const getModuloName = (moduloId: string): string => {
  const modulo = menuItems.find(item => item.id === moduloId);
  return modulo?.name || 'Módulo não encontrado';
};

// Função para obter o path do módulo
export const getModuloPath = (moduloId: string): string => {
  const modulo = menuItems.find(item => item.id === moduloId);
  return modulo?.path || '';
};

// Função para verificar se um módulo está em construção
export const isModuloEmConstrucao = (moduloId: string): boolean => {
  const modulo = menuItems.find(item => item.id === moduloId);
  return modulo?.name.includes('Em breve') || false;
}; 