"use client";

import { ReactNode } from 'react';
import '@/styles/base/home.scss';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { id: 'visits-home', name: 'Home', path: '/visitas' }, // Caminho amigável
  { id: 'visits-agenda', name: 'Agenda', path: '/agenda' }, // Caminho amigável
  { id: 'visits-locations', name: 'Locais', path: '/locais-de-visitas' }, // Caminho amigável
  { id: 'visits-prescribers', name: 'Prescritores', path: '/visitas/prescritores' }, // Caminho amigável
  { id: 'visits-list-management', name: 'Gerenciamento de Lista', path: '/agenda-lista' }, // Atualizado para apontar para a pasta list
  { id: 'visits-vehicles', name: 'Veículos', path: '/visitas/veiculos' }, // Caminho amigável
  { id: 'visits-reports', name: 'Relatórios', path: '/visitas/relatorios' }, // Novo item para relatórios
  { id: 'visits-settings', name: 'Configurações', path: '/visitas/configuracoes' }, // Caminho amigável
];

const quickActionItems = [
  { id: 'quick-reports', name: 'Relatórios', path: '/visitas/relatorios', icon: 'chart' },
  { id: 'quick-agenda', name: 'Agenda', path: '/agenda', icon: 'calendar' },
];

export default function VisitsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="content-wrapper">
      <div className="visits-layout">
        <aside className="visits-sidebar">
          <nav className="visits-nav">
            <ul className="visits-menu">
              {menuItems.map((item) => (
                <li key={item.id} className={pathname === item.path ? 'active' : ''}>
                  <Link href={item.path} className="visits-menu-item">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="visits-content-wrapper">
          <div className="visits-quick-actions">
            {quickActionItems.map((item) => (
              <Link key={item.id} href={item.path} className="quick-action-btn">
                {item.icon === 'chart' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                )}
                {item.icon === 'calendar' && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                )}
                {item.name}
              </Link>
            ))}
          </div>
          <main className="visits-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}