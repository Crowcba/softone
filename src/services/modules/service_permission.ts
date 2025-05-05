import { getUserModulePermissions, ModulePermission } from '../../api/modules/permission';

interface UserPermissions {
  modules: ModulePermission[];
  hasPermission: (moduleName: string) => boolean;
  hasPermissionById: (moduleId: number) => boolean;
  getActiveModules: () => ModulePermission[];
}

export async function getUserPermissions(): Promise<UserPermissions> {
  try {
    // Obter ID do usuário do sessionStorage
    const userInfo = sessionStorage.getItem('info_usuario');
    if (!userInfo) {
      return createEmptyPermissions();
    }
    
    const userData = JSON.parse(userInfo);
    const userId = userData.id;
    
    if (!userId) {
      return createEmptyPermissions();
    }
    
    const modulePermissions = await getUserModulePermissions(userId);
    
    return {
      modules: modulePermissions,
      
      hasPermission(moduleName: string): boolean {
        const moduleNameUppercase = moduleName.toUpperCase();
        return modulePermissions.some(
          module => module.nome === moduleNameUppercase && module.status === true
        );
      },
      
      hasPermissionById(moduleId: number): boolean {
        return modulePermissions.some(
          module => module.id_modulo === moduleId && module.status === true
        );
      },
      
      getActiveModules(): ModulePermission[] {
        return modulePermissions.filter(module => module.status === true);
      }
    };
  } catch (error) {
    console.error('Erro ao obter permissões do usuário:', error);
    return createEmptyPermissions();
  }
}

function createEmptyPermissions(): UserPermissions {
  return {
    modules: [],
    hasPermission: () => false,
    hasPermissionById: () => false,
    getActiveModules: () => [],
  };
}
