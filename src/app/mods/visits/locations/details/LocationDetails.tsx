"use client";

import React from 'react';
import styles from './page.module.scss';
import { visitsLocation } from '../../../../../api/visits/visits_locations';

interface LocationDetailsProps {
  location: visitsLocation;
  loading: boolean;
  onBackClick: () => void;
  onEditClick: (location: visitsLocation) => void;
  onStatusUpdated: (updatedLocation: visitsLocation) => void;
}

export default function LocationDetails({ 
  location, 
  loading, 
  onBackClick, 
  onEditClick,
  onStatusUpdated 
}: LocationDetailsProps) {
  const [updating, setUpdating] = React.useState(false);

  const handleToggleStatus = async () => {
    if (!location || updating) return;
    setUpdating(true);
    // Implementar a lógica de toggle do status
    setUpdating(false);
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando detalhes...</div>;
  }

  if (!location) {
    return <div className={styles.error}>Não foi possível carregar os detalhes do local.</div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <button onClick={onBackClick} className={styles.backButton}>
          Voltar
        </button>
        <h2>Detalhes do Local</h2>
      </div>

      <div className={styles.detailsContent}>
        <div className={styles.detailsSection}>
          <h3>Informações Básicas</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Nome do Local</label>
              <span>{location.localDeAtendimentoOrigemDestino}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3>Endereço</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Logradouro</label>
              <span>{location.enderecoOrigemDestino}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Número</label>
              <span>{location.numeroOrigemDestino || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Bairro</label>
              <span>{location.bairroOrigemDestino}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Cidade</label>
              <span>{location.cidadeOrigemDestino}</span>
            </div>
            <div className={styles.detailItem}>
              <label>UF</label>
              <span>{location.ufOrigemDestino}</span>
            </div>
            <div className={styles.detailItem}>
              <label>CEP</label>
              <span>{location.cepOrigemDestino}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3>Contato</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Telefone</label>
              <span>{location.telefoneOrigemDestino || '-'}</span>
            </div>
          </div>
        </div>

        <div className={styles.detailsButtonContainer}>
          <button 
            onClick={onBackClick} 
            className={styles.detailsButton}
            style={{ backgroundColor: "#666" }}
          >
            Voltar
          </button>
          <button 
            onClick={() => onEditClick(location)}
            className={styles.detailsButton}
            style={{ backgroundColor: "#008C45" }}
          >
            Editar Local
          </button>
          <button 
            onClick={handleToggleStatus}
            className={styles.detailsButton}
            style={{ 
              backgroundColor: location.status ? "#DC2626" : "#16A34A",
              opacity: updating ? 0.7 : 1 
            }}
            disabled={updating}
          >
            {updating ? "Atualizando..." : location.status ? "Desativar" : "Ativar"}
          </button>
        </div>
      </div>
    </div>
  );
} 