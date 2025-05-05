"use client";

import React, { useState, useEffect } from "react";
import VisitasProfissionaisService, { VisitasProfissional } from "../../../../services/visits/service_visits_prescribers";
import { PrescriberFilterState, filterPrescribers, paginatePrescribers, calculateTotalPages } from "./prescriber";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import PrescriberDetails from './components/PrescriberDetails';
import { usePrescriberDetails } from './details/details';
import RegisterPrescriber from './components/RegisterPrescriber';
import { WhatsAppCell, LocationCell } from './components/TableCells';

export default function PrescribersPage() {
  const router = useRouter();
  const [prescribers, setPrescribers] = useState<VisitasProfissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PrescriberFilterState>({
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 10,
    statusFilter: "all"
  });
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedPrescriber, setSelectedPrescriber] = useState<VisitasProfissional | null>(null);
  const { loading: loadingDetails, updatePrescriberStatus } = usePrescriberDetails();

  useEffect(() => {
    async function loadPrescribers() {
      try {
        setLoading(true);
        const data = await VisitasProfissionaisService.getAllVisitasProfissionais();
        setPrescribers(data);
      } catch (error) {
        console.error("Erro ao carregar prescritores:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPrescribers();
  }, []);

  const filteredPrescribers = filterPrescribers(prescribers, filters);
  const totalPages = calculateTotalPages(filteredPrescribers.length, filters.itemsPerPage);
  const prescribersToDisplay = paginatePrescribers(
    filteredPrescribers, 
    filters.currentPage, 
    filters.itemsPerPage
  );

  const handlePrescriberClick = (prescriber: VisitasProfissional) => {
    setSelectedPrescriber(prescriber);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
  };

  const handleEditClick = (prescriber: VisitasProfissional) => {
    router.push(`/mods/visits/prescriber/edit?id=${prescriber.idProfissional}`);
  };

  const handleStatusUpdated = async (updatedPrescriber: VisitasProfissional) => {
    try {
      const success = await VisitasProfissionaisService.updateStatus(
        updatedPrescriber.idProfissional,
        updatedPrescriber.status
      );
      
      if (success) {
        // Atualiza o prescritor selecionado
        setSelectedPrescriber(updatedPrescriber);
        
        // Atualiza a lista de prescritores
        setPrescribers(prev =>
          prev.map(p =>
            p.idProfissional === updatedPrescriber.idProfissional
              ? updatedPrescriber
              : p
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleRegisterSuccess = (newPrescriber: VisitasProfissional) => {
    setPrescribers(prev => [newPrescriber, ...prev]);
    setShowAddPanel(false);
    setSelectedPrescriber(newPrescriber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 5;
    let startPage = Math.max(filters.currentPage - Math.floor(pagesToShow / 2), 1);
    let endPage = startPage + pagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    const pages: JSX.Element[] = [];
    
    pages.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(Math.max(filters.currentPage - 1, 1))}
        disabled={filters.currentPage === 1}
        className={styles.paginationButton}
      >
        &laquo; Anterior
      </button>
    );

    if (startPage > 1) {
      pages.push(
        <button key="1" onClick={() => handlePageChange(1)} className={styles.paginationButton}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className={styles.paginationEllipsis}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={`${styles.paginationButton} ${filters.currentPage === i ? styles.paginationActive : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className={styles.paginationEllipsis}>...</span>);
      }
      pages.push(
        <button 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)}
          className={styles.paginationButton}
        >
          {totalPages}
        </button>
      );
    }

    pages.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(Math.min(filters.currentPage + 1, totalPages))}
        disabled={filters.currentPage === totalPages}
        className={styles.paginationButton}
      >
        Próximo &raquo;
      </button>
    );

    return <div className={styles.paginationContainer}>{pages}</div>;
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Prescritores</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por nome do prescritor..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            style={{ 
              backgroundColor: '#444',
              border: '1px solid #555',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              padding: '12px 16px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          <select
            value={filters.statusFilter}
            onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value as any })}
            title="Filtrar por status"
            style={{ 
              backgroundColor: '#444',
              border: '1px solid #555',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              padding: '12px 16px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
          <button 
            className={styles.newButton}
            onClick={() => setShowAddPanel(true)}
          >
            + Novo Prescritor
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando...</p>
          </div>
        ) : showAddPanel ? (
          <RegisterPrescriber
            onSuccess={handleRegisterSuccess}
            onCancel={() => setShowAddPanel(false)}
          />
        ) : selectedPrescriber ? (
          <PrescriberDetails
            prescriber={selectedPrescriber}
            loading={loadingDetails}
            onBackClick={() => setSelectedPrescriber(null)}
            onEditClick={handleEditClick}
            onStatusUpdated={handleStatusUpdated}
          />
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Nome</th>
                  <th className={styles.tableHeaderCell}>Especialidade</th>
                  <th className={styles.tableHeaderCell}>WhatsApp</th>
                  <th className={styles.tableHeaderCell}>Local de Atendimento</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {prescribersToDisplay.map((prescriber) => (
                  <tr 
                    key={prescriber.idProfissional}
                    className={styles.tableRow}
                    onClick={() => handlePrescriberClick(prescriber)}
                  >
                    <td className={styles.tableCell}>{prescriber.nomeProfissional}</td>
                    <td className={styles.tableCell}>{prescriber.especialidadeProfissional}</td>
                    <td className={styles.tableCell}>
                      <WhatsAppCell idProfissional={prescriber.idProfissional} />
                    </td>
                    <td className={styles.tableCell}>
                      <LocationCell idProfissional={prescriber.idProfissional} />
                    </td>
                    <td className={styles.tableCell}>
                      <span className={prescriber.status ? styles.statusActive : styles.statusInactive}>
                        {prescriber.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        )}
      </main>
      
      {/* Floating action button for mobile */}
      {!showAddPanel && !selectedPrescriber && !loading && (
        <button 
          className={styles.mobileFloatingButton}
          onClick={() => setShowAddPanel(true)}
          aria-label="Adicionar novo prescritor"
        >
          +
        </button>
      )}
    </div>
  );
}
