// Define interfaces for our data structures
export interface MenuItem {
  id?: string | number;
  path?: string;
  codigo?: string | number;
  name?: string;
  label?: string;
  nome?: string;
  [key: string]: any;
}

interface ModuloAtivo {
  id?: string | number;
  path?: string;
  codigo?: string | number;
  nome?: string;
  [key: string]: any;
}

interface ComparisonResult {
  matching: MenuItem[];
  nonMatching: MenuItem[];
}

// Mapeamento de nomes de módulos em português para equivalentes em inglês
const moduleNameMapping: Record<string, string> = {
  'VISITAS': 'visits',
  'VENDAS': 'vendas',
  'CONFIGURAÇÃO': 'config',
  'HOME': 'home',
  'LOGOUT': 'logout',
  'BOMBA': 'bomba',
  'BOLETO': 'boleto',
  'COMPRAS': 'compras',
  'ESTOQUE': 'estoque',
  'FATURAMENTO': 'faturamento',
  'FINANCEIRO': 'financeiro',
  'LICITAÇÃO': 'licitacao',
  'MARKETING': 'marketing',
  'PRODUÇÃO': 'producao',
  'RELATÓRIOS': 'relatorios',
  'RH': 'rh'
};

/**
 * Converte nome do módulo em português para seu equivalente em inglês
 * @param portugueseName - Nome do módulo em português
 * @returns Nome do módulo em inglês ou o nome original se não houver mapeamento
 */
function convertModuleName(portugueseName?: string): string | undefined {
  if (!portugueseName) return undefined;
  
  const upperName = portugueseName.toUpperCase();
  return moduleNameMapping[upperName] || portugueseName.toLowerCase();
}

/**
 * Compares active modules from sessionStorage with menu items
 * @param menuItems - Array of menu items to check against active modules
 * @returns Object containing matching and non-matching items
 */
export function compareModulesWithMenu(menuItems: MenuItem[]): ComparisonResult {
  // Get active modules from sessionStorage
  let modulosAtivos: ModuloAtivo[] = [];
  
  // Only run this in browser environment
  if (typeof window !== 'undefined') {
    try {
      const modulosAtivosStr = sessionStorage.getItem('modulos_ativos');
      
      if (modulosAtivosStr) {
        modulosAtivos = JSON.parse(modulosAtivosStr);
      }
    } catch (error) {
      console.error('Error parsing modulos_ativos from sessionStorage:', error);
      return { matching: [], nonMatching: menuItems };
    }
  }
  
  // If no active modules, all menu items are non-matching
  if (!modulosAtivos || !modulosAtivos.length) {
    return { matching: [], nonMatching: menuItems };
  }
  
  // Compare menu items with active modules
  const matching = menuItems.filter(item => 
    modulosAtivos.some(modulo => {
      // Verificar correspondência direta
      const directMatch = (modulo.id !== undefined && modulo.id === item.id) || 
                         (modulo.path && modulo.path === item.path) || 
                         (modulo.codigo !== undefined && modulo.codigo === item.codigo);
      
      // Verificar correspondência pelo nome convertido
      const convertedName = convertModuleName(modulo.nome);
      
      const nameMatch = convertedName && (
        convertedName === item.id || 
        (item.path && item.path.includes(`/${convertedName}`))
      );
      
      return directMatch || nameMatch;
    })
  );
  
  const nonMatching = menuItems.filter(item => 
    !modulosAtivos.some(modulo => {
      // Verificar correspondência direta
      const directMatch = (modulo.id !== undefined && modulo.id === item.id) || 
                         (modulo.path && modulo.path === item.path) || 
                         (modulo.codigo !== undefined && modulo.codigo === item.codigo);
      
      // Verificar correspondência pelo nome convertido
      const convertedName = convertModuleName(modulo.nome);
      const nameMatch = convertedName && (
        convertedName === item.id || 
        (item.path && item.path.includes(`/${convertedName}`))
      );
      
      return directMatch || nameMatch;
    })
  );
  
  return { matching, nonMatching };
}

/**
 * Utilidade para verificar os módulos ativos no console
 * Pode ser chamada a partir do console do navegador
 */
export function debugModulosAtivos(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const modulosAtivosStr = sessionStorage.getItem('modulos_ativos');
    
    if (modulosAtivosStr) {
      const modulosAtivos = JSON.parse(modulosAtivosStr);
    }
  } catch (error) {
    console.error('Erro ao debugar módulos ativos:', error);
  }
}

/**
 * Filters menu items based on user's active modules
 * @param menuItems - Array of menu items to process
 * @param onNonMatchingItem - Optional callback function for non-matching items
 * @returns Filtered menu items that match active modules
 */
export function filterMenuByPermissions(
  menuItems: MenuItem[], 
  onNonMatchingItem?: (item: MenuItem) => void
): MenuItem[] {
  const { matching, nonMatching } = compareModulesWithMenu(menuItems);
  
  // Call the provided function for each non-matching item if provided
  if (typeof onNonMatchingItem === 'function' && nonMatching.length > 0) {
    nonMatching.forEach(item => onNonMatchingItem(item));
  }
  
  return matching;
}
