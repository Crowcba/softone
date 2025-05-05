import React, { useEffect, useState, useRef } from 'react';
import { getVisitsService } from '@/services/visits/service_visits_prescriber';
import { visitsPrescriber } from '@/api/visits/visits_prescriber';
import styles from './prescribers-list.module.css';

interface PrescribersListProps {
  onSelect: (prescritor: visitsPrescriber) => void;
  className?: string;
  placeholder?: string;
  initialValue?: string;
  label?: string;
  required?: boolean;
}

const PrescribersList: React.FC<PrescribersListProps> = ({
  onSelect,
  className = '',
  placeholder = 'Buscar prescritor...',
  initialValue = '',
  label = 'Prescritor',
  required = false
}) => {
  const [prescribers, setPrescribers] = useState<visitsPrescriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fechar dropdown quando clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && inputRef.current && 
          !dropdownRef.current.contains(event.target as Node) &&
          !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carregar prescritores ao montar o componente
  useEffect(() => {
    const loadPrescribers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const visitsService = await getVisitsService();
        const data = await visitsService.getPrescribers();
        
        if (data && data.length > 0) {
          setPrescribers(data);
        } else {
          console.warn('Nenhum prescritor encontrado na API');
          // Manter lista anterior se já carregou alguma vez
          setError('Não foi possível carregar a lista de prescritores.');
        }
      } catch (error) {
        console.error('Erro ao carregar prescritores:', error);
        setError('Erro ao carregar prescritores. Por favor, tente novamente.');
        
        // Se ainda não tem dados e tentou menos de 3 vezes, tenta novamente após 3 segundos
        if (prescribers.length === 0 && loadAttempts < 3) {
          setTimeout(() => {
            setLoadAttempts(prev => prev + 1);
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPrescribers();
  }, [loadAttempts]);

  // Filtrar prescritores baseado na busca
  const filteredPrescribers = prescribers.filter(prescritor => {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    return prescritor.nomePrescriber.toLowerCase().includes(searchLower) || 
           (prescritor.especialidadePrescriber && prescritor.especialidadePrescriber.toLowerCase().includes(searchLower)) ||
           (prescritor.crmPrescriber && prescritor.crmPrescriber.toLowerCase().includes(searchLower));
  });

  // Selecionar prescritor
  const handleSelect = (prescritor: visitsPrescriber) => {
    onSelect(prescritor);
    setSearch(prescritor.nomePrescriber);
    setIsOpen(false);
  };

  // Permitir selecionar manualmente um prescritor quando API falha
  const handleManualEntry = () => {
    if (search.trim()) {
      const manualPrescritor: visitsPrescriber = {
        idPrescriber: 0,
        nomePrescriber: search.trim(),
        crmPrescriber: '',
        especialidadePrescriber: '',
        status: true,
        observacoes: 'Entrada manual'
      };
      onSelect(manualPrescritor);
      setIsOpen(false);
    }
  };

  // Mostrar todas as opções ou resultados filtrados
  const displayItems = search.trim() ? filteredPrescribers : prescribers;

  return (
    <div className={`${styles.formGroup} ${className}`}>
      <label htmlFor="searchPrescriber">{label} {required && <span className={styles.required}>*</span>}</label>
      <input
        ref={inputRef}
        type="text"
        id="searchPrescriber"
        className={styles.input}
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        disabled={loading}
      />
      
      {loading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {isOpen && (
        <div className={styles.prescriberDropdown} ref={dropdownRef}>
          {displayItems.length === 0 ? (
            <div className={styles.prescriberOption}>
              {search.trim() ? (
                <>
                  Nenhum prescritor encontrado
                  <button 
                    type="button" 
                    onClick={handleManualEntry}
                    className={styles.manualEntryButton}
                  >
                    Usar entrada manual
                  </button>
                </>
              ) : (
                'Nenhum prescritor disponível'
              )}
            </div>
          ) : (
            displayItems.slice(0, 10).map((prescritor) => (
              <div
                key={prescritor.idPrescriber}
                className={styles.prescriberOption}
                onClick={() => handleSelect(prescritor)}
              >
                {prescritor.nomePrescriber}
              </div>
            ))
          )}
        </div>
      )}
      
      {error && !isOpen && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          {search.trim() && (
            <button 
              type="button" 
              onClick={handleManualEntry}
              className={styles.manualEntryButton}
            >
              Usar entrada manual
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PrescribersList; 