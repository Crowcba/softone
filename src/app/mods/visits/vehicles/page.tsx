"use client";

import React, { useState, useEffect } from "react";
import { getVisitsVehicleService } from "../../../../services/visits/service_visits_vehicle";
import { VisitsVehicle } from "../../../../api/visits/visits_vehicle";
import { VehicleFilterState, filterVehicles, paginateVehicles, calculateTotalPages } from "./vhicles";
import styles from "./table.module.css";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VisitsVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VehicleFilterState>({
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 10,
    statusFilter: "all"
  });
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VisitsVehicle | null>(null);
  const [vehicleService, setVehicleService] = useState<any>(null);

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true);
        const service = await getVisitsVehicleService();
        setVehicleService(service);
        
        // Obtém o ID do usuário do cookie
        const userId = Cookies.get('user_id');
        
        // Se tiver userId, carrega apenas os veículos desse usuário
        // Caso contrário, carrega todos os veículos (comportamento de fallback)
        const data = userId 
          ? await service.getVehiclesByUser(userId)
          : await service.getVehicles();
          
        setVehicles(data);
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  const filteredVehicles = filterVehicles(vehicles, filters);
  const totalPages = calculateTotalPages(filteredVehicles.length, filters.itemsPerPage);
  const vehiclesToDisplay = paginateVehicles(
    filteredVehicles, 
    filters.currentPage, 
    filters.itemsPerPage
  );

  const handleVehicleClick = (vehicle: VisitsVehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
  };

  const handleEditClick = (vehicle: VisitsVehicle) => {
    router.push(`/mods/visits/vehicles/edit?id=${vehicle.idVeiculo}`);
  };

  const handleStatusToggle = async (vehicle: VisitsVehicle) => {
    if (!vehicleService) return;
    
    try {
      const updatedVehicle = await vehicleService.toggleVehicleStatus(vehicle.idVeiculo);
      
      if (updatedVehicle) {
        // Atualiza o veículo selecionado
        setSelectedVehicle(updatedVehicle);
        
        // Atualiza a lista de veículos
        setVehicles(prev =>
          prev.map(v =>
            v.idVeiculo === updatedVehicle.idVeiculo
              ? updatedVehicle
              : v
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleRegisterSuccess = (newVehicle: VisitsVehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    setShowAddPanel(false);
    setSelectedVehicle(newVehicle);
  };

  const handleAddNewVehicle = () => {
    router.push('/mods/visits/vehicles/register');
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

  const renderVehicleDetails = () => {
    if (!selectedVehicle) return null;

    return (
      <div className={styles.detailsContainer}>
        <div className={styles.detailsHeader}>
          <h2 className={styles.detailsTitle}>Detalhes do Veículo</h2>
          <div className={styles.detailsButtons}>
            <button 
              className={styles.backButton}
              onClick={() => setSelectedVehicle(null)}
            >
              Voltar
            </button>
            <button 
              className={styles.editButton}
              onClick={() => handleEditClick(selectedVehicle)}
            >
              Editar
            </button>
            <button 
              className={`${styles.paginationButton} ${selectedVehicle.ativo ? styles.statusActive : styles.statusInactive}`}
              onClick={() => handleStatusToggle(selectedVehicle)}
            >
              {selectedVehicle.ativo ? 'Desativar' : 'Ativar'}
            </button>
          </div>
        </div>
        
        <div className={styles.detailsGrid}>
          <div className={styles.detailsItem}>
            <div className={styles.detailsLabel}>Placa</div>
            <div className={styles.detailsValue}>{selectedVehicle.placaVeiculo || '-'}</div>
          </div>
          
          <div className={styles.detailsItem}>
            <div className={styles.detailsLabel}>Marca/Modelo</div>
            <div className={styles.detailsValue}>{selectedVehicle.marcaModeloVeiculo || '-'}</div>
          </div>
          
          <div className={styles.detailsItem}>
            <div className={styles.detailsLabel}>Modelo</div>
            <div className={styles.detailsValue}>{selectedVehicle.modeloVeiculo || '-'}</div>
          </div>
          
          <div className={styles.detailsItem}>
            <div className={styles.detailsLabel}>Cor</div>
            <div className={styles.detailsValue}>{selectedVehicle.corVeiculo || '-'}</div>
          </div>
          
          <div className={styles.detailsItem}>
            <div className={styles.detailsLabel}>Proprietário</div>
            <div className={styles.detailsValue}>{selectedVehicle.proprietarioVeiculo || '-'}</div>
          </div>
          
          <div className={styles.detailsItem}>
            <div className={styles.detailsLabel}>Status</div>
            <div className={styles.detailsValue}>
              <span className={selectedVehicle.ativo ? styles.statusActive : styles.statusInactive}>
                {selectedVehicle.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Veículos</h1>
        {!selectedVehicle && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por placa, marca/modelo ou proprietário..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              style={{ 
                backgroundColor: '#444',
                border: '1px solid #555',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                padding: '12px 16px',
                minWidth: '300px'
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
                minWidth: '150px'
              }}
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
            <button 
              className={styles.newButton}
              onClick={handleAddNewVehicle}
            >
              + Novo Veículo
            </button>
          </div>
        )}
      </header>

      <main>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Carregando...</p>
          </div>
        ) : selectedVehicle ? (
          renderVehicleDetails()
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Placa</th>
                  <th className={styles.tableHeaderCell}>Marca/Modelo</th>
                  <th className={styles.tableHeaderCell}>Cor</th>
                  <th className={styles.tableHeaderCell}>Proprietário</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {vehiclesToDisplay.map((vehicle) => (
                  <tr 
                    key={vehicle.idVeiculo}
                    className={styles.tableRow}
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    <td className={styles.tableCell}>{vehicle.placaVeiculo}</td>
                    <td className={styles.tableCell}>{vehicle.marcaModeloVeiculo}</td>
                    <td className={styles.tableCell}>{vehicle.corVeiculo}</td>
                    <td className={styles.tableCell}>{vehicle.proprietarioVeiculo}</td>
                    <td className={styles.tableCell}>
                      <span className={vehicle.ativo ? styles.statusActive : styles.statusInactive}>
                        {vehicle.ativo ? 'Ativo' : 'Inativo'}
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
    </div>
  );
}
