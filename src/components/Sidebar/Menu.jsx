import { filterMenuByPermissions } from '../../utils/modulePermissions';

function SidebarMenu() {
  // Example menu items
  const allMenuItems = [
    { id: 1, name: 'Dashboard', path: '/home' },
    { id: 2, name: 'Visitas', path: '/visitas' },
    { id: 3, name: 'Relatórios', path: '/relatorios' },
    { id: 4, name: 'Configurações', path: '/configuracoes' },
  ];

  // Filter menu items based on active modules in sessionStorage
  const visibleMenuItems = filterMenuByPermissions(allMenuItems, (item) => {
    // You could also dispatch an action or update state here
  });

  return (
    <nav className="sidebar-nav">
      <ul>
        {visibleMenuItems.map((item) => (
          <li key={item.id}>
            <a href={item.path}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SidebarMenu;
