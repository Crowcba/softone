"use client";

import React, { useState, useEffect } from "react";
import { getVisitsService } from "../../../../services/visits/service_visits_locations";
import { visitsLocation } from "../../../../api/visits/visits_locations";
import { LocationsFilterState, filterLocations, paginateLocations, calculateTotalPages } from "./locations";
import styles from "./table.module.css";
import RegisterLocation from './register/RegisterLocation';
import { useRouter } from "next/navigation";
import LocationDetails from './details/LocationDetails';
import { useLocationDetails } from "./details/details";

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<visitsLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LocationsFilterState>({
    searchTerm: "",
    currentPage: 1,
    itemsPerPage: 10,
    statusFilter: "all"
  });
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<visitsLocation | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { fetchLocationDetails } = useLocationDetails();

  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true);
        const service = await getVisitsService();
        const data = await service.getLocations();
        setLocations(data);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  useEffect(() => {
    if (filters.searchTerm !== "") {
      setFilters(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [filters.searchTerm]);

  const filteredLocations = filterLocations(locations, filters);
  const totalPages = calculateTotalPages(filteredLocations.length, filters.itemsPerPage);
  const locationsToDisplay = paginateLocations(
    filteredLocations, 
    filters.currentPage, 
    filters.itemsPerPage
  );

  const handleLocationClick = async (location: visitsLocation) => {
    try {
      setLoadingDetails(true);
      const detailedLocation = await fetchLocationDetails(location.idOrigemDestino);
      setSelectedLocation(detailedLocation || location);
    } catch (error) {
      console.error("Erro ao carregar detalhes do local:", error);
      setSelectedLocation(location);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    setSelectedLocation(null);
  };

  const handleEditClick = (location: visitsLocation) => {
    router.push(`/mods/visits/locations/edit?id=${location.idOrigemDestino}`);
  };

  const handleStatusUpdated = (updatedLocation: visitsLocation) => {
    setLocations(prev => 
      prev.map(loc => 
        loc.idOrigemDestino === updatedLocation.idOrigemDestino 
          ? {...updatedLocation} 
          : loc
      )
    );
  };

  const displayPhone = (phone: string) => {
    if (!phone) return '-';
    
    if (phone.match(/^\d+$/)) {
      const value = phone.replace(/\D/g, '');
      if (value.length > 10) {
        return '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
      } else if (value.length > 6) {
        return '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6, 10);
      }
    }
    
    return phone;
  };
  
  const handleRegisterSuccess = (newLocation: visitsLocation) => {
    setLocations(prev => [newLocation, ...prev]);
    setShowAddPanel(false);
    setSelectedLocation(newLocation);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, currentPage: page }));
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

    const pages = [];
    
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
        <h1 className={styles.pageTitle}>Locais de Visitas</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por nome do local..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            style={{ 
              backgroundColor: '#444',
              border: '1px solid #555',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              padding: '12px 16px',
              minWidth: '300px'
            }}
          />
          <select
            value={filters.statusFilter}
            onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value as "all" | "active" | "inactive" })}
            title="Filtrar por status"
            style={{ 
              backgroundColor: '#444',
              border: '1px solid #555',
              borderRadius: '8px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              cursor: 'pointer',
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
            onClick={() => {
              setShowAddPanel(true);
              setSelectedLocation(null);
            }}
          >
            + Novo Local
          </button>
        </div>
      </header>

      <main>
        {showAddPanel ? (
          <RegisterLocation
            onSuccess={handleRegisterSuccess}
            onCancel={() => setShowAddPanel(false)}
          />
        ) : selectedLocation ? (
          <LocationDetails 
            location={selectedLocation}
            loading={loadingDetails}
            onBackClick={closeDetails}
            onEditClick={handleEditClick}
            onStatusUpdated={handleStatusUpdated}
          />
        ) : (
          loading ? (
            <div className={styles.loadingContainer}>
              <p>Carregando...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>Nome</th>
                    <th className={styles.tableHeaderCell}>Endereço</th>
                    <th className={styles.tableHeaderCell}>Telefone</th>
                    <th className={styles.tableHeaderCell}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {locationsToDisplay.map((location) => (
                    <tr 
                      key={location.idOrigemDestino}
                      className={styles.tableRow}
                      onClick={() => handleLocationClick(location)}
                    >
                      <td className={styles.tableCell}>{location.localDeAtendimentoOrigemDestino}</td>
                      <td className={styles.tableCell}>
                        {location.enderecoOrigemDestino}
                        {location.numeroOrigemDestino && `, ${location.numeroOrigemDestino}`}
                        {location.bairroOrigemDestino && ` - ${location.bairroOrigemDestino}`}
                      </td>
                      <td className={styles.tableCell}>{displayPhone(location.telefoneOrigemDestino)}</td>
                      <td className={styles.tableCell}>
                        <span className={location.status === true ? styles.statusActive : styles.statusInactive}>
                          {location.status === true ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPagination()}
            </div>
          )
        )}
      </main>
    </div>
  );
}
