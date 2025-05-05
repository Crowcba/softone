'use client';

import React, { useEffect, useState } from 'react';
import { getVisitsList, getVisitDetails } from './services';
import type { VisitListProps, FilterState, LocalPrescritor, VisitDetails as VisitDetailsType } from './types';
import { visitsLocation } from '@/api/visits/visits_locations';
import Link from 'next/link';
import styles from './table.module.css';

// Importando o componente de detalhes
import VisitDetails from './details/VisitDetails';

export default function VisitListPage() {
  const [visits, setVisits] = useState<VisitListProps>({
    data: [],
    isLoading: true,
    error: null,
    filters: {
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 10
    }
  });
  
  const [selectedVisit, setSelectedVisit] = useState<VisitDetailsType | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleVisitClick = async (id: number) => {
    setLoadingDetails(true);
    const details = await getVisitDetails(id);
    setSelectedVisit(details);
    setLoadingDetails(false);
  };

  const handleBackClick = () => {
    setSelectedVisit(null);
  };

  useEffect(() => {
    const loadVisits = async () => {
      const result = await getVisitsList(visits.filters);
      setVisits(result);
    };
    loadVisits();
  }, [visits.filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisits(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        searchTerm: e.target.value,
        currentPage: 1
      }
    }));
  };

  const handlePageChange = (page: number) => {
    setVisits(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        currentPage: page
      }
    }));
  };

  return (
    <div className={styles.container}>
      {selectedVisit ? (
        <VisitDetails 
          visit={selectedVisit} 
          loading={loadingDetails}
          onBackClick={handleBackClick}
        />
      ) : (
        <>
          <div className={styles.header}>
            <Link 
              href="/agenda-lista/register" 
              className={styles.newButton}
            >
              Nova Lista
            </Link>
            <Link 
              href="/agenda/from-list" 
              className={styles.newButton}
            >
              Agendar Visitas
            </Link>
          </div>

          <WorkArea 
            visits={visits}
            handleSearch={handleSearch}
            handlePageChange={handlePageChange}
            onVisitClick={handleVisitClick}
          />
        </>
      )}
    </div>
  );
}

// Componente WorkArea permanece o mesmo
const WorkArea = ({ visits, handleSearch, handlePageChange, onVisitClick }: {
  visits: VisitListProps;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageChange: (page: number) => void;
  onVisitClick: (id: number) => void;
}) => {
  if (visits.isLoading) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  if (visits.error) {
    return <div className={styles.error}>{visits.error}</div>;
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar visitas..."
          value={visits.filters.searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>ID</th>
              <th className={styles.tableHeaderCell}>Descrição</th>
              <th className={styles.tableHeaderCell}>Local de Atendimento</th>
              <th className={styles.tableHeaderCell}>Endereço</th>
              <th className={styles.tableHeaderCell}>Bairro</th>
              <th className={styles.tableHeaderCell}>Cidade</th>
              <th className={styles.tableHeaderCell}>UF</th>
              <th className={styles.tableHeaderCell}>CEP</th>
              <th className={styles.tableHeaderCell}>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {visits.data.map((visit: LocalPrescritor & { localInfo: visitsLocation | null }) => (
              <tr 
                key={visit.id} 
                className={styles.tableRow}
                onClick={() => onVisitClick(visit.id)}
              >
                <td className={styles.tableCell}>{visit.id}</td>
                <td className={styles.tableCell}>{visit.descricao}</td>
                <td className={styles.tableCell}>{visit.localInfo?.localDeAtendimentoOrigemDestino || 'Local não encontrado'}</td>
                <td className={styles.tableCell}>{visit.localInfo?.enderecoOrigemDestino || '-'}</td>
                <td className={styles.tableCell}>{visit.localInfo?.bairroOrigemDestino || '-'}</td>
                <td className={styles.tableCell}>{visit.localInfo?.cidadeOrigemDestino || '-'}</td>
                <td className={styles.tableCell}>{visit.localInfo?.ufOrigemDestino || '-'}</td>
                <td className={styles.tableCell}>{visit.localInfo?.cepOrigemDestino || '-'}</td>
                <td className={styles.tableCell}>{visit.localInfo?.telefoneOrigemDestino || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <button
          onClick={() => handlePageChange(visits.filters.currentPage - 1)}
          disabled={visits.filters.currentPage === 1}
          className={styles.paginationButton}
        >
          Anterior
        </button>
        <span className={styles.paginationEllipsis}>
          Página {visits.filters.currentPage}
        </span>
        <button
          onClick={() => handlePageChange(visits.filters.currentPage + 1)}
          disabled={visits.data.length < visits.filters.itemsPerPage}
          className={styles.paginationButton}
        >
          Próxima
        </button>
      </div>
    </>
  );
};



