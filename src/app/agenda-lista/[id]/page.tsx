'use client';

import React, { useEffect, useState } from 'react';
import { getVisitDetails, VisitDetails } from './details';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './details.module.css';

export default function VisitDetailsPage() {
  const params = useParams();
  const [visit, setVisit] = useState<VisitDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVisitDetails = async () => {
      try {
        setIsLoading(true);
        const id = params.id as string;
        const details = await getVisitDetails(id);
        
        if (!details) {
          setError('Visita não encontrada');
          return;
        }
        
        setVisit(details);
      } catch (err) {
        setError('Erro ao carregar detalhes da visita');
      } finally {
        setIsLoading(false);
      }
    };

    loadVisitDetails();
  }, [params.id]);

  if (isLoading) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!visit) {
    return <div className={styles.error}>Visita não encontrada</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Detalhes da Visita</h1>
        <Link 
          href="/agenda-lista" 
          className={styles.backButton}
        >
          Voltar para Lista
        </Link>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações da Visita</h2>
            <div className={styles.field}>
              <span className={styles.label}>ID</span>
              <p className={styles.value}>{visit.id}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Descrição</span>
              <p className={styles.value}>{visit.descricao}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>ID do Local</span>
              <p className={styles.value}>{visit.idLocal}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>ID do Usuário</span>
              <p className={styles.value}>{visit.idUsuario}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações do Local</h2>
            <div className={styles.field}>
              <span className={styles.label}>Local de Atendimento</span>
              <p className={styles.value}>{visit.localInfo?.localDeAtendimentoOrigemDestino || 'Não disponível'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Endereço</span>
              <p className={styles.value}>{visit.localInfo?.enderecoOrigemDestino || 'Não disponível'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Bairro</span>
              <p className={styles.value}>{visit.localInfo?.bairroOrigemDestino || 'Não disponível'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Cidade</span>
              <p className={styles.value}>{visit.localInfo?.cidadeOrigemDestino || 'Não disponível'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>UF</span>
              <p className={styles.value}>{visit.localInfo?.ufOrigemDestino || 'Não disponível'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>CEP</span>
              <p className={styles.value}>{visit.localInfo?.cepOrigemDestino || 'Não disponível'}</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Telefone</span>
              <p className={styles.value}>{visit.localInfo?.telefoneOrigemDestino || 'Não disponível'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 