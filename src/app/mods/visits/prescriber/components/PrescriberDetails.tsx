"use client";

import React from 'react';
import { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';
import styles from '../details/details.module.css';

interface PrescriberDetailsProps {
  prescriber: VisitasProfissional;
  loading: boolean;
  onBackClick: () => void;
  onEditClick: (prescriber: VisitasProfissional) => void;
  onStatusUpdated: (updatedPrescriber: VisitasProfissional) => Promise<void>;
}

export default function PrescriberDetails({
  prescriber,
  loading,
  onBackClick,
  onEditClick,
  onStatusUpdated
}: PrescriberDetailsProps) {
  const [updating, setUpdating] = React.useState(false);

  const handleToggleStatus = async () => {
    if (!prescriber || updating) return;
    setUpdating(true);
    try {
      await onStatusUpdated(prescriber);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando detalhes...</div>;
  }

  if (!prescriber) {
    return <div className={styles.error}>Não foi possível carregar os detalhes do prescritor.</div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <button onClick={onBackClick} className={styles.backButton}>
          Voltar
        </button>
        <h2>Detalhes do Prescritor</h2>
      </div>

      <div className={styles.detailsContent}>
        <div className={styles.detailsSection}>
          <h3>Informações Básicas</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Nome</label>
              <span>{prescriber.nomeProfissional}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Número do Conselho</label>
              <span>{prescriber.numeroConselhoProfissional || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Especialidade</label>
              <span>{prescriber.especialidadeProfissional || '-'}</span>
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
            onClick={() => onEditClick(prescriber)}
            className={styles.detailsButton}
            style={{ backgroundColor: "#008C45" }}
          >
            Editar Prescritor
          </button>
          <button 
            onClick={handleToggleStatus}
            className={styles.detailsButton}
            style={{ 
              backgroundColor: prescriber.status ? "#DC2626" : "#16A34A",
              opacity: updating ? 0.7 : 1 
            }}
            disabled={updating}
          >
            {updating ? "Atualizando..." : prescriber.status ? "Desativar" : "Ativar"}
          </button>
        </div>
      </div>
    </div>
  );
} 