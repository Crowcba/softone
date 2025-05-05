/**
 * Compares active modules from sessionStorage with menu items
 * @param {Array} menuItems - Array of menu items to check against active modules
 * @returns {Object} - Object containing matching and non-matching items
 */
export function compareModulesWithMenu(menuItems) {
  // Get active modules from sessionStorage
  let modulosAtivos = [];
  
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
    modulosAtivos.some(modulo => 
      (modulo.id === item.id) || 
      (modulo.path === item.path) || 
      (modulo.codigo === item.codigo)
    )
  );
  
  const nonMatching = menuItems.filter(item => 
    !modulosAtivos.some(modulo => 
      (modulo.id === item.id) || 
      (modulo.path === item.path) || 
      (modulo.codigo === item.codigo)
    )
  );
  
  return { matching, nonMatching };
}

/**
 * Processes menu items based on user's active modules
 * @param {Array} menuItems - Array of menu items to process
 * @param {Function} onNonMatchingItem - Function to call for each non-matching item (optional)
 * @returns {Array} - Filtered menu items that match active modules
 */
export function filterMenuByPermissions(menuItems, onNonMatchingItem = null) {
  const { matching, nonMatching } = compareModulesWithMenu(menuItems);
  
  // Call the provided function for each non-matching item if provided
  if (typeof onNonMatchingItem === 'function' && nonMatching.length > 0) {
    nonMatching.forEach(item => onNonMatchingItem(item));
  }
  
  return matching;
}
