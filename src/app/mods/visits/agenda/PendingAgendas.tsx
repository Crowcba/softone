'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAgendasDoCache, salvarAgendasNoCache, sincronizarAgendasPendentes } from '@/services/visits/service_visits_verification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Estilos inline para o componente
const styles = {
  container: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eaeaea',
    borderRadius: '8px',
    backgroundColor: '#fff9ec'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: 0
  },
  list: {
    margin: '10px 0'
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  info: {
    flex: 1
  },
  date: {
    color: '#666',
    fontSize: '0.9rem'
  },
  location: {
    color: '#444',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  syncButton: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white'
  },
  emptyMessage: {
    padding: '10px',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center' as const
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '0.9rem'
  }
};

export default function PendingAgendas({ onSync }: { onSync?: () => void }) {
  const [pendingAgendas, setPendingAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar agendas pendentes do cache local
  useEffect(() => {
    const loadPendingAgendas = () => {
      try {
        const agendas = getAgendasDoCache();
        const pendentes = agendas.filter(a => !a.salvaNaApi);
        setPendingAgendas(pendentes);
      } catch (error) {
        console.error('Erro ao carregar agendas pendentes:', error);
        toast.error('Erro ao carregar agendas pendentes do cache local.');
      }
    };

    loadPendingAgendas();
    
    // Recarregar a cada 30 segundos para manter atualizado
    const interval = setInterval(loadPendingAgendas, 30000);
    return () => clearInterval(interval);
  }, []);

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Sincronizar todas as agendas pendentes
  const handleSyncAll = async () => {
    setLoading(true);
    try {
      const result = await sincronizarAgendasPendentes();
      
      if (result.success > 0) {
        toast.success(`${result.success} agendamento(s) sincronizado(s) com sucesso!`);
      }
      
      if (result.failed > 0) {
        toast.warn(`${result.failed} agendamento(s) não puderam ser sincronizados.`);
      }
      
      // Recarregar a lista
      const agendas = getAgendasDoCache();
      const pendentes = agendas.filter(a => !a.salvaNaApi);
      setPendingAgendas(pendentes);
      
      // Chamar callback se fornecido
      if (onSync) {
        onSync();
      }
    } catch (error) {
      console.error('Erro ao sincronizar agendas:', error);
      toast.error('Erro ao sincronizar agendas pendentes.');
    } finally {
      setLoading(false);
    }
  };

  // Remover uma agenda do cache local
  const handleRemove = (id: string | number) => {
    try {
      const agendas = getAgendasDoCache();
      const filteredAgendas = agendas.filter(a => a.id !== id);
      salvarAgendasNoCache(filteredAgendas);
      
      // Atualizar a lista local
      const pendentes = filteredAgendas.filter(a => !a.salvaNaApi);
      setPendingAgendas(pendentes);
      
      toast.success('Agendamento removido do cache local.');
    } catch (error) {
      console.error('Erro ao remover agenda do cache:', error);
      toast.error('Erro ao remover agendamento do cache local.');
    }
  };

  // Se não houver agendas pendentes, não mostrar o componente
  if (pendingAgendas.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Agendamentos Pendentes de Sincronização ({pendingAgendas.length})
        </h3>
        <button 
          style={{...styles.button, ...styles.syncButton}}
          onClick={handleSyncAll}
          disabled={loading}
        >
          {loading ? 'Sincronizando...' : 'Sincronizar Todos'}
        </button>
      </div>
      
      <div style={styles.list}>
        {pendingAgendas.length === 0 ? (
          <div style={styles.emptyMessage}>
            Não há agendamentos pendentes de sincronização.
          </div>
        ) : (
          pendingAgendas.map(agenda => (
            <div key={agenda.id} style={styles.listItem}>
              <div style={styles.info}>
                <div style={styles.date}>
                  {formatDate(agenda.data)} - Período: {agenda.periodo === 0 ? 'Manhã' : agenda.periodo === 1 ? 'Tarde' : 'Noite'}
                </div>
                {agenda.erro && (
                  <div style={styles.errorText}>
                    Erro: {agenda.erro}
                  </div>
                )}
              </div>
              <div style={styles.actions}>
                <button 
                  style={{...styles.button, ...styles.deleteButton}}
                  onClick={() => handleRemove(agenda.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 