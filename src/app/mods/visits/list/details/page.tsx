'use client';

import React from 'react';
import styles from './page.module.scss';
import { VisitDetails as VisitDetailsType } from '../types';

interface PageProps {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}

const VisitDetailsPage: React.FC<PageProps> = () => {
  const [visit, setVisit] = React.useState<VisitDetailsType | null>(null);
  const [loading, setLoading] = React.useState(true);

  const handleBackClick = () => {
    window.history.back();
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando detalhes...</div>;
  }

  if (!visit) {
    return <div className={styles.error}>Não foi possível carregar os detalhes.</div>;
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <button onClick={handleBackClick} className={styles.backButton}>
          Voltar
        </button>
        <h2>Detalhes da Lista de Visitas</h2>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <label>ID</label>
          <span>{visit.id}</span>
        </div>
        <div className={styles.detailItem}>
          <label>Descrição</label>
          <span>{visit.descricao}</span>
        </div>
      </div>

      {visit.localInfo && (
        <div className={styles.localSection}>
          <h3>Local de Atendimento</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Nome</label>
              <span>{visit.localInfo.localDeAtendimentoOrigemDestino || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Endereço</label>
              <span>{visit.localInfo.enderecoOrigemDestino || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Cidade</label>
              <span>{visit.localInfo.cidadeOrigemDestino || '-'}</span>
            </div>
            <div className={styles.detailItem}>
              <label>UF</label>
              <span>{visit.localInfo.ufOrigemDestino || '-'}</span>
            </div>
          </div>
          <div className={styles.navigationButtons}>
            <button
              onClick={() => {
                if (!visit.localInfo) return;
                const address = encodeURIComponent(
                  `${visit.localInfo.enderecoOrigemDestino || ''}, ${visit.localInfo.cidadeOrigemDestino || ''}, ${visit.localInfo.ufOrigemDestino || ''}`
                );
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
              }}
              className={`${styles.navigationButton} ${styles.mapsButton}`}
              title="Abrir no Google Maps"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              Google Maps
            </button>
            <button
              onClick={() => {
                if (!visit.localInfo) return;
                const address = encodeURIComponent(
                  `${visit.localInfo.enderecoOrigemDestino || ''}, ${visit.localInfo.cidadeOrigemDestino || ''}, ${visit.localInfo.ufOrigemDestino || ''}`
                );
                window.open(`https://www.waze.com/ul?ll=${address}&navigate=yes`, '_blank');
              }}
              className={`${styles.navigationButton} ${styles.wazeButton}`}
              title="Abrir no Waze"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M13.83 5.5C18.64 5.5 22.5 9.36 22.5 14.17c0 4.81-3.86 8.67-8.67 8.67-4.81 0-8.67-3.86-8.67-8.67 0-4.81 3.86-8.67 8.67-8.67zm-3.37 9.64c0 .71.57 1.29 1.29 1.29.71 0 1.29-.57 1.29-1.29 0-.71-.57-1.29-1.29-1.29-.71 0-1.29.57-1.29 1.29zm5.45 0c0 .71.57 1.29 1.29 1.29.71 0 1.29-.57 1.29-1.29 0-.71-.57-1.29-1.29-1.29-.71 0-1.29.57-1.29 1.29zm-2.71 3.37c-1.29 0-2.38-.52-3.01-1.29h6.02c-.63.77-1.72 1.29-3.01 1.29z"/>
              </svg>
              Waze
            </button>
          </div>
        </div>
      )}

      {visit.prescritores && visit.prescritores.length > 0 && (
        <div className={styles.prescritoresSection}>
          <h3>Prescritores ({visit.prescritores.length})</h3>
          <ul className={styles.prescriberList}>
            {visit.prescritores.map(prescritor => (
              <li key={prescritor.idPrescritor} className={styles.prescriberItem}>
                <div className={styles.prescriberInfo}>
                  <span className={styles.prescriberName}>{prescritor.nomeProfissional}</span>
                  <div className={styles.prescriberDetails}>
                    <span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                      </svg>
                      {prescritor.especialidadeProfissional}
                    </span>
                    <span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M12 2L1 12h3v9h7v-6h2v6h7v-9h3L12 2zm0 2.84L19.93 12H18v7h-4v-6H10v6H6v-7H4.07L12 4.84z"/>
                      </svg>
                      {prescritor.conselhoProfissional} {prescritor.numeroConselhoProfissional}
                    </span>
                  </div>
                  <span className={styles.prescriberBadge}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    Profissional Ativo
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VisitDetailsPage;