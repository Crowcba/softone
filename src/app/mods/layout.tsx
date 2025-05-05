"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '@/styles/base/layout.scss';
import { getMenuItems, MenuItem } from '@/utils/menuManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ícone para a logo
const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="32" viewBox="0 0 96 32">
    <style type="text/css">
      {`.st0{fill:#FFFFFF;}
        .st1{fill:#E83700;}`}
    </style>
    <g id="Tipografia_1_">
      <path className="st0" d="M0.6,23.8v-3.7h11.1v-3.7H4.3c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6V9c0-1,0.4-1.9,1.1-2.6
        c0.7-0.7,1.6-1.1,2.6-1.1h11.1V9H4.3v3.7h7.4c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6v3.7c0,1-0.4,1.9-1.1,2.6
        c-0.7,0.7-1.6,1.1-2.6,1.1H0.6z"/>
      <path className="st0" d="M20,23.8c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6v-7.4c0-1,0.4-1.9,1.1-2.6C18.1,9.3,19,9,20,9h7.4
        c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6v7.4c0,1-0.4,1.9-1.1,2.6c-0.7,0.7-1.6,1.1-2.6,1.1H20z M27.4,20.1v-7.4H20v7.4H27.4z
        "/>
      <path className="st0" d="M32,23.8V9c0-1,0.4-1.9,1.1-2.6c0.7-0.7,1.6-1.1,2.6-1.1h3.7V9h-3.7v0.9h3.7v3.7h-3.7v10.2H32z"/>
      <path className="st0" d="M44.1,20.1L44.1,20.1L44.1,20.1l0-6.5h3.7V9.8h-3.7V5.3h-3.7v14.8c0,1,0.4,1.9,1.1,2.6
        c0.7,0.7,1.6,1.1,2.6,1.1h3.7v-3.7H44.1z"/>
      <g>
        <path className="st0" d="M64.4,20.6v3.2h3.7v-3.6C66.9,20.2,65.7,20.4,64.4,20.6z"/>
        <path className="st0" d="M78.2,10.1C77.4,9.3,76.6,9,75.6,9h-7.4c-1,0-1.9,0.4-2.6,1.1c-0.7,0.7-1.1,1.6-1.1,2.6v6.1
          c1.2-0.1,2.4-0.2,3.6-0.2c0,0,0,0,0.1,0v-5.9h7.4v11.1h3.7V12.7C79.3,11.6,78.9,10.8,78.2,10.1z"/>
      </g>
      <g>
        <path className="st0" d="M62.1,20.9c-3,0.5-5.9,1.2-8.4,2c0-0.1,0.1-0.3,0.2-0.4c-0.2,0.1-0.5,0.1-0.7,0.2c0.3-1,1.8-1.9,4-2.7h-4.8V9
          h9.1V5.2h-9.3v0c-0.9,0-1.8,0.4-2.5,1.1c-0.7,0.7-1.1,1.6-1.1,2.6v11.1c0,1,0.4,1.9,1.1,2.6c0.7,0.7,1.6,1.1,2.6,1.1h7.4
          c1,0,1.9-0.4,2.6-1.1c0.6-0.6,0.9-1.2,1.1-2C63,20.8,62.6,20.8,62.1,20.9z"/>
        <path className="st1" d="M63.5,18.6v-7.5h0V5.2H60v0.2L57.5,9h2.3v10.3c-6.2,1.4-10.7,3.9-10.9,6.2c2.4-1.3,5.1-2.6,8-3.7
          c6.1-2.3,11.9-3.3,16.5-3.3C70.7,18.2,67.2,18.1,63.5,18.6z"/>
      </g>
      <path className="st0" d="M83.9,23.8c-1,0-1.9-0.4-2.6-1.1c-0.7-0.7-1.1-1.6-1.1-2.6v-7.4c0-1,0.4-1.9,1.1-2.6C82,9.3,82.9,9,83.9,9h7.4
        c1,0,1.9,0.4,2.6,1.1c0.7,0.7,1.1,1.6,1.1,2.6v5.6H83.9v1.9H95v3.7H83.9z M91.3,14.5v-1.9h-7.4v1.9H91.3z"/>
    </g>
  </svg>
);

// Ícones para os módulos
const getModuleIcon = (name: string | number | undefined) => {
  // Converter para string ou usar um valor padrão seguro
  const iconName = name?.toString().toLowerCase() || 'default';
  
  switch (iconName) {
    case 'home':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      );
    case 'bomba':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        </svg>
      );
    case 'boleto':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="M7 15h0M7 11h0M7 7h0M11 15h0M11 11h0M11 7h0M15 15h0M15 11h0M15 7h0M19 15h0M19 11h0M19 7h0"></path>
        </svg>
      );
    case 'compras':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      );
    case 'estoque':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6H4c-.8 0-1.3.9-.8 1.6L9 16v3h6v-3l5.8-8.4c.5-.7 0-1.6-.8-1.6Z"></path>
          <path d="M12 16v3"></path>
        </svg>
      );
    case 'faturamento':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <path d="M14 2v6h6"></path>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
          <path d="M10 9H8"></path>
        </svg>
      );
    case 'financeiro':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
          <path d="M12 18V6"></path>
        </svg>
      );
    case 'licitacao':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 15V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10"></path>
          <path d="m17 21 2-2-2-2"></path>
          <path d="M12 7H7"></path>
          <path d="M12 11H7"></path>
          <path d="M7 15h2"></path>
        </svg>
      );
    case 'marketing':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 6.3a9 9 0 0 1 0 11.4"></path>
          <path d="M16 8.7a5 5 0 0 1 0 6.6"></path>
          <rect width="8" height="12" x="3" y="6" rx="3"></rect>
        </svg>
      );
    case 'producao':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h2"></path>
          <path d="M6 8h2"></path>
          <path d="M10 4h2"></path>
          <path d="M18 8h2"></path>
          <path d="M20 12h2"></path>
          <path d="M14 4h2"></path>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="m16 16-1.9-1.9"></path>
          <path d="M8 8.9 9.9 7"></path>
          <path d="M12 16v2"></path>
          <path d="M12 6V4"></path>
          <path d="m16 7 1.9-1.9"></path>
          <path d="M9.9 16.8 8 18.7"></path>
        </svg>
      );
    case 'relatorios':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 21H7.8c-1.7 0-2.5 0-3.1-.327a3 3 0 0 1-1.311-1.311C3 18.8 3 18 3 16.2V3"></path>
          <path d="M7 9h3m-3 3h6m0 3h-6"></path>
          <path d="M16 13h2"></path>
          <path d="M19 13h0"></path>
          <path d="M16 17h2"></path>
          <path d="M19 17h0"></path>
          <path d="M16 9h2"></path>
          <path d="M19 9h0"></path>
        </svg>
      );
    case 'rh':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case 'vendas':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20.01V11"></path>
          <path d="M4 4v2"></path>
          <path d="M12 14v2"></path>
          <path d="M12 4v2"></path>
          <path d="M20 14v2"></path>
          <path d="M20 4v2"></path>
          <path d="M4 7v4"></path>
          <path d="M12 7v7"></path>
          <path d="M20 7v7"></path>
          <path d="M3 11h18"></path>
          <path d="m6 19-2 2v-4l2 2Z"></path>
          <path d="m14 13-2 2v-4l2 2Z"></path>
          <path d="m22 13-2 2v-4l2 2Z"></path>
        </svg>
      );
    case 'visits':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      );
    case 'config':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      );
    case 'logout':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
        </svg>
      );
  }
};

// Nosso menu com tipo definido
const menuItems: MenuItem[] = [
  { id: 'home', name: 'Home (Em breve)', path: '/home' },
  { id: 'bomba', name: 'Bomba (Em breve)', path: '' },
  { id: 'boleto', name: 'Boleto (Em breve)', path: '' },
  { id: 'compras', name: 'Compras (Em breve)', path: '' },
  { id: 'estoque', name: 'Estoque (Em breve)', path: '' },
  { id: 'faturamento', name: 'Faturamento (Em breve)', path: '' },
  { id: 'financeiro', name: 'Financeiro (Em breve)', path: '' },
  { id: 'licitacao', name: 'Licitação (Em breve)', path: '' },
  { id: 'marketing', name: 'Marketing (Em breve)', path: '' },
  { id: 'producao', name: 'Produção (Em breve)', path: '' },
  { id: 'relatorios', name: 'Relatórios (Em breve)', path: '' },
  { id: 'rh', name: 'RH (Em breve)', path: '' },
  { id: 'vendas', name: 'Vendas (Em breve)', path: '' },
  { id: 'visits', name: 'Visitas (em construcao)', path: '/visitas' },
  { id: 'config', name: 'Configuração (Em breve)', path: '' },
];

// Componente para partículas decorativas
const Particles: React.FC = () => {
  return (
    <>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </>
  );
};

// Componente para o botão de colapsar (renderizado apenas no cliente)
const CollapseButton: React.FC<{collapsed: boolean; onClick: () => void, hasMounted: boolean}> = ({collapsed, onClick, hasMounted}) => {
  // Usar um ícone estático para o servidor e o ícone dinâmico apenas após montar no cliente
  const iconPath = !hasMounted 
    ? "M13 16l-6-4 6-4v8z"  // Usar valor padrão consistente para o servidor
    : (collapsed ? "M7 16l10-4-10-4v8z" : "M13 16l-6-4 6-4v8z");

  return (
    <button className="collapse-button" onClick={onClick} aria-label="Colapsar menu">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="collapse-icon">
        <path d={iconPath}></path>
      </svg>
    </button>
  );
};

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [empresasLiberadas, setEmpresasLiberadas] = useState<Array<{
    idEmpresa: string;
    fantasiaEmpresa: string;
    logoEmpresa?: string;
  }>>([]);
  const [empresaAtiva, setEmpresaAtiva] = useState<string>('');
  const [showCompanySelector, setShowCompanySelector] = useState<boolean>(false);
  const companySelectorRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>(menuItems);

  // Efeito para marcar que o componente foi montado
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Efeito para inicializar o estado do sidebar após a montagem do componente
  useEffect(() => {
    // Inicializa o estado do sidebar com o valor salvo no localStorage (se existir)
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('menuCollapsed');
      if (savedState === 'true') {
        setCollapsed(true);
      }
    }
  }, []);

  useEffect(() => {
    // Não verificar token em páginas excluídas
    const isExcludedPage = pathname === '/login' || 
                           pathname === '/logout' || 
                           pathname.includes('/login');
    if (isExcludedPage) {
      return;
    }

    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Carregar informações do usuário
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Carregar informações da empresa
    const empresasLiberadasStr = sessionStorage.getItem('empresas_liberadas');
    const empresaAtivaStr = sessionStorage.getItem('empresa_ativa');
    
    if (empresasLiberadasStr && empresaAtivaStr) {
      try {
        const empresas = JSON.parse(empresasLiberadasStr);
        setEmpresasLiberadas(empresas);
        setEmpresaAtiva(empresaAtivaStr);
        
        const empresa = empresas.find((e: {idEmpresa: string, fantasiaEmpresa: string, logoEmpresa?: string}) => 
          String(e.idEmpresa) === empresaAtivaStr
        );
        if (empresa) {
          setCompanyName(empresa.fantasiaEmpresa);
          if (empresa.logoEmpresa) {
            setLogoUrl(empresa.logoEmpresa);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar informações da empresa:', error);
      }
    }

    // Carregar logo do sistema se existir
    try {
      const logo = localStorage.getItem('systemLogo');
      if (logo && !logoUrl) {
        setLogoUrl(logo);
      }
    } catch {
      console.error('Erro ao carregar logo');
    }

    // Carregar itens do menu usando a nova função
    const menuItems = getMenuItems();
    setFilteredMenuItems(menuItems);

    // Detectar tamanho da tela para colapsar automaticamente em telas pequenas
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
        setMobileMenuOpen(false);
      }
    };

    // Chamar handleResize inicialmente e adicionar event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [router, pathname, logoUrl]);

  useEffect(() => {
    // Adicionar listener para fechar o seletor quando clicar fora
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (companySelectorRef.current && !companySelectorRef.current.contains(event.target as Node)) {
        setShowCompanySelector(false);
      }
    }

    // Adicionar o listener apenas quando o seletor estiver aberto
    if (showCompanySelector) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showCompanySelector]);

  const handleLogout = () => {
    router.push('/mods/logout');
  };

  const toggleSidebar = () => {
    // Inverte o estado atual
    const newState = !collapsed;
    // Atualiza o estado
    setCollapsed(newState);
    // Salva o estado no localStorage
    localStorage.setItem('menuCollapsed', String(newState));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Em dispositivos móveis, não queremos que o menu esteja colapsado
    if (window.innerWidth < 768) {
      setCollapsed(false);
    }
  };

  const toggleCompanySelector = () => {
    setShowCompanySelector(!showCompanySelector);
  };

  const handleCompanyChange = (idEmpresa: string) => {
    sessionStorage.setItem('empresa_ativa', idEmpresa);
    window.location.reload(); // Recarrega a página para atualizar todas as informações
  };

  // Não aplicar layout em páginas específicas como login, logout
  const isExcludedPage = pathname === '/login' || 
                         pathname === '/mods/logout' || 
                         pathname.includes('/login');

  // Se for uma página excluída, apenas renderiza o conteúdo sem o layout
  if (isExcludedPage) {
    return <>{children}</>;
  }

  return (
    <div className={`layout-container ${hasMounted && collapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <Particles />
      
      {/* Overlay para o menu mobile */}
      <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      
      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="company-logo" />
            ) : (
              <div className="default-logo">
                <LogoIcon />
              </div>
            )}
            <span className="company-name">{companyName || 'SoftOne ERP'}</span>
          </div>
          
          <CollapseButton collapsed={collapsed} onClick={toggleSidebar} hasMounted={hasMounted} />
        </div>
        
        <nav className="sidebar-nav">
          <ul className="menu-list">
            {filteredMenuItems.map((item) => (
              <li key={item.id?.toString() || 'item'} className={pathname.startsWith(item.path) ? 'active' : ''}>
                <a
                  href={item.path || '#'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.path) {
                      router.push(item.path);
                    }
                  }}
                  className="menu-item"
                >
                  <span className="menu-icon">{getModuleIcon(item.id)}</span>
                  <span className="menu-text">{item.name || 'Menu Item'}</span>
                </a>
                {item.subItems && pathname.startsWith(item.path) && (
                  <ul className="submenu-list">
                    {item.subItems.map((subItem) => (
                      <li key={subItem.id} className={pathname === subItem.path ? 'active' : ''}>
                        <a
                          href={subItem.path}
                          onClick={(e) => {
                            e.preventDefault();
                            if (subItem.path) {
                              router.push(subItem.path);
                            }
                          }}
                          className="submenu-item"
                        >
                          <span className="menu-text">{subItem.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            
            <li className="logout-item">
              <button onClick={handleLogout} className="menu-item logout-button">
                <span className="menu-icon">{getModuleIcon('logout')}</span>
                <span className="menu-text">Sair do Sistema</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="main-content">
        <header className="top-header">
          <button className="mobile-menu-button" onClick={toggleMobileMenu} aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="user-info">
            {/* Seletor de Empresa - Apenas aparece se houver mais de uma empresa */}
            {empresasLiberadas.length > 1 && (
              <div className="company-selector-container" ref={companySelectorRef}>
                <button 
                  className="company-selector-button" 
                  onClick={toggleCompanySelector}
                  aria-haspopup="listbox"
                >
                  <span className="company-name-display">{companyName}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={showCompanySelector ? "rotate-180" : ""}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                
                {showCompanySelector && (
                  <div className="company-selector-dropdown">
                    {empresasLiberadas.map((empresa) => (
                      <button 
                        key={empresa.idEmpresa}
                        className={`company-option ${String(empresa.idEmpresa) === empresaAtiva ? 'active' : ''}`}
                        onClick={() => handleCompanyChange(String(empresa.idEmpresa))}
                      >
                        {empresa.logoEmpresa ? (
                          <img src={empresa.logoEmpresa} alt={empresa.fantasiaEmpresa} className="company-option-logo" />
                        ) : (
                          <div className="company-option-default-logo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                              <path d="M7 15h0"></path>
                            </svg>
                          </div>
                        )}
                        <span>{empresa.fantasiaEmpresa}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="user-details">
              <span className="username">{username}</span>
            </div>
          </div>
        </header>
        
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      
      {/* ToastContainer para exibir notificações */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
} 