"use client";

import React, { useState, useEffect } from 'react';

// Estilos para o módulo de auditoria
const styles = {
  pageContainer: `
    p-6 max-w-[1400px] mx-auto 
    bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800
    min-h-[calc(100vh-80px)] rounded-lg shadow-sm
  `,
  
  pageHeader: `
    mb-8 border-b pb-4 border-blue-100 dark:border-gray-700
  `,
  
  pageTitle: `
    text-3xl font-bold mb-2 text-blue-800 dark:text-blue-400
    flex items-center
  `,
  
  titleIcon: `
    mr-3 text-blue-600 dark:text-blue-400
  `,
  
  pageDescription: `
    text-gray-600 dark:text-gray-300
  `,
  
  sectionTitle: `
    text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200
    flex items-center before:content-[''] before:block before:w-2 before:h-6 
    before:bg-blue-500 dark:before:bg-blue-600 before:rounded-md before:mr-2
  `,
  
  table: `
    min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow
  `,
  
  tableHeader: `
    bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider
  `,
  
  tableHeaderCell: `
    px-5 py-3 border-b border-gray-200 dark:border-gray-600
  `,
  
  tableRow: `
    hover:bg-gray-50 dark:hover:bg-gray-700
  `,
  
  tableCell: `
    px-5 py-4 border-b border-gray-200 dark:border-gray-600 text-sm
  `,
  
  actionButton: `
    bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md 
    transition-colors shadow-sm hover:shadow flex items-center justify-center
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  
  searchInput: `
    border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md w-full
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
  `,
  
  filterContainer: `
    flex flex-col md:flex-row gap-4 mb-6
  `,
  
  filterItem: `
    flex-1
  `,
  
  filterLabel: `
    block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1
  `,
  
  filterSelect: `
    border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md w-full
    focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
  `,
  
  successBadge: `
    px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 
    text-xs rounded-full font-medium
  `,
  
  warningBadge: `
    px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 
    text-xs rounded-full font-medium
  `,
  
  dangerBadge: `
    px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 
    text-xs rounded-full font-medium
  `,
  
  paginationContainer: `
    flex justify-between items-center mt-6 text-sm
  `,
  
  paginationButton: `
    px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  
  loadingContainer: `
    flex items-center justify-center h-[calc(100vh-200px)]
  `,
  
  spinner: `
    animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4
  `,
};

// Componente de ícone para o título
const AuditTitleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.titleIcon}>
    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>
);

// Interface para os registros de auditoria
interface AuditRecord {
  id: string;
  userId: string;
  username: string;
  action: string;
  module: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export default function AuditPage() {
  const [loading, setLoading] = useState(true);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;
  
  // Simular carregamento de dados
  useEffect(() => {
    // Aqui você buscaria dados de uma API real
    setTimeout(() => {
      // Dados de exemplo
      const sampleData: AuditRecord[] = [
        {
          id: '1',
          userId: 'U001',
          username: 'admin',
          action: 'Login',
          module: 'Autenticação',
          ip: '192.168.1.1',
          timestamp: '2023-06-15 08:30:45',
          status: 'success'
        },
        {
          id: '2',
          userId: 'U002',
          username: 'maria.silva',
          action: 'Visualização',
          module: 'Visitas',
          ip: '192.168.1.2',
          timestamp: '2023-06-15 09:15:22',
          status: 'success'
        },
        {
          id: '3',
          userId: 'U003',
          username: 'joao.santos',
          action: 'Tentativa de Acesso',
          module: 'Permissões',
          ip: '192.168.1.3',
          timestamp: '2023-06-15 10:05:11',
          status: 'error'
        },
        {
          id: '4',
          userId: 'U001',
          username: 'admin',
          action: 'Alteração',
          module: 'Prescritores',
          ip: '192.168.1.1',
          timestamp: '2023-06-15 11:22:30',
          status: 'success'
        },
        {
          id: '5',
          userId: 'U004',
          username: 'ana.oliveira',
          action: 'Tentativa de Login',
          module: 'Autenticação',
          ip: '192.168.1.4',
          timestamp: '2023-06-15 13:10:05',
          status: 'warning'
        },
        {
          id: '6',
          userId: 'U002',
          username: 'maria.silva',
          action: 'Exclusão',
          module: 'Locais',
          ip: '192.168.1.2',
          timestamp: '2023-06-15 14:30:18',
          status: 'success'
        },
        {
          id: '7',
          userId: 'U005',
          username: 'carlos.ferreira',
          action: 'Download',
          module: 'Relatórios',
          ip: '192.168.1.5',
          timestamp: '2023-06-15 15:45:33',
          status: 'success'
        },
        {
          id: '8',
          userId: 'U001',
          username: 'admin',
          action: 'Acesso Bloqueado',
          module: 'Veículos',
          ip: '192.168.1.1',
          timestamp: '2023-06-15 16:20:07',
          status: 'error'
        },
        {
          id: '9',
          userId: 'U003',
          username: 'joao.santos',
          action: 'Visualização',
          module: 'Agenda',
          ip: '192.168.1.3',
          timestamp: '2023-06-15 17:05:42',
          status: 'success'
        },
        {
          id: '10',
          userId: 'U002',
          username: 'maria.silva',
          action: 'Alteração',
          module: 'Prescritores',
          ip: '192.168.1.2',
          timestamp: '2023-06-15 18:15:29',
          status: 'success'
        },
        {
          id: '11',
          userId: 'U004',
          username: 'ana.oliveira',
          action: 'Login',
          module: 'Autenticação',
          ip: '192.168.1.4',
          timestamp: '2023-06-16 08:10:15',
          status: 'success'
        },
        {
          id: '12',
          userId: 'U001',
          username: 'admin',
          action: 'Alteração de Permissões',
          module: 'Permissões',
          ip: '192.168.1.1',
          timestamp: '2023-06-16 09:30:22',
          status: 'success'
        }
      ];
      
      setAuditRecords(sampleData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Filtrar registros
  const filteredRecords = auditRecords.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ip.includes(searchTerm);
      
    const matchesModule = moduleFilter === '' || record.module === moduleFilter;
    const matchesStatus = statusFilter === '' || record.status === statusFilter;
    
    return matchesSearch && matchesModule && matchesStatus;
  });
  
  // Paginação
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const currentRecords = filteredRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );
  
  // Renderizar o status com o badge correto
  const renderStatus = (status: string) => {
    switch (status) {
      case 'success':
        return <span className={styles.successBadge}>Sucesso</span>;
      case 'warning':
        return <span className={styles.warningBadge}>Alerta</span>;
      case 'error':
        return <span className={styles.dangerBadge}>Erro</span>;
      default:
        return null;
    }
  };
  
  // Obter módulos únicos para o filtro
  const uniqueModules = Array.from(new Set(auditRecords.map(record => record.module)));
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <div className={styles.spinner}></div>
          <p>Carregando registros de auditoria...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <AuditTitleIcon />
          Auditoria do Sistema
        </h1>
        <p className={styles.pageDescription}>Monitore todas as atividades e acessos ao sistema</p>
      </header>
      
      {/* Filtros */}
      <div className={styles.filterContainer}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Pesquisar</label>
          <input
            type="text"
            placeholder="Pesquisar por usuário, ação ou IP..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Módulo</label>
          <select 
            className={styles.filterSelect}
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            aria-label="Filtrar por módulo"
          >
            <option value="">Todos os Módulos</option>
            {uniqueModules.map((module) => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>Status</label>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="">Todos os Status</option>
            <option value="success">Sucesso</option>
            <option value="warning">Alerta</option>
            <option value="error">Erro</option>
          </select>
        </div>
      </div>
      
      {/* Tabela de Registros */}
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.tableHeaderCell}`}>Data/Hora</th>
              <th className={`${styles.tableHeaderCell}`}>Usuário</th>
              <th className={`${styles.tableHeaderCell}`}>Ação</th>
              <th className={`${styles.tableHeaderCell}`}>Módulo</th>
              <th className={`${styles.tableHeaderCell}`}>IP</th>
              <th className={`${styles.tableHeaderCell}`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record) => (
              <tr key={record.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{record.timestamp}</td>
                <td className={styles.tableCell}>{record.username}</td>
                <td className={styles.tableCell}>{record.action}</td>
                <td className={styles.tableCell}>{record.module}</td>
                <td className={styles.tableCell}>{record.ip}</td>
                <td className={styles.tableCell}>{renderStatus(record.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Paginação */}
      <div className={styles.paginationContainer}>
        <div>
          Mostrando {currentRecords.length} de {filteredRecords.length} registros
        </div>
        <div className="flex gap-2">
          <button 
            className={styles.paginationButton}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {page} de {totalPages}
          </span>
          <button 
            className={styles.paginationButton}
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
} 