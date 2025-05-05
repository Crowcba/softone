'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getLocations, getPrescribers, type RegisterFormData } from './register';
import styles from '../table.module.css';
import { OrigemDestino } from '@/services/visits/service_visits_locations';
import { VisitasProfissional } from '@/api/visits/visits_prescribers';
import { createLocalPrescritor } from '@/api/visits/visits_list_agenda';
import { createPrescriberList } from '@/api/visits/visits_list_agenda_prescribers';
import { getLinksByProfessionalId, createAddressProfessionalLink } from '@/api/visits/visits_address_professional_links';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const router = useRouter();
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const prescriberDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    descricao: '',
    idLocal: 0,
    prescritores: []
  });
  const [locations, setLocations] = useState<OrigemDestino[]>([]);
  const [prescribers, setPrescribers] = useState<VisitasProfissional[]>([]);
  const [selectedPrescribers, setSelectedPrescribers] = useState<VisitasProfissional[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPrescriber, setSearchPrescriber] = useState('');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPrescriberOpen, setIsPrescriberOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [locationsResult, prescribersResult] = await Promise.all([
          getLocations(),
          getPrescribers()
        ]);

        if (locationsResult.success) {
          setLocations(locationsResult.data || []);
        } else {
          setError(locationsResult.error || 'Erro ao carregar locais');
        }
        
        if (prescribersResult.success) {
          setPrescribers(prescribersResult.data || []);
        } else {
          setError(prescribersResult.error || 'Erro ao carregar prescritores');
        }
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (prescriberDropdownRef.current && !prescriberDropdownRef.current.contains(event.target as Node)) {
        setIsPrescriberOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = locations.filter(location => {
    const searchTerm = searchLocation.toLowerCase();
    return (
      (location.localDeAtendimentoOrigemDestino?.toLowerCase() || '').includes(searchTerm) ||
      (location.enderecoOrigemDestino?.toLowerCase() || '').includes(searchTerm) ||
      (location.cidadeOrigemDestino?.toLowerCase() || '').includes(searchTerm)
    );
  });

  const filteredPrescribers = prescribers.filter(prescriber => {
    const searchTerm = searchPrescriber.toLowerCase();
    const isAlreadySelected = selectedPrescribers.some(
      selected => selected.idProfissional === prescriber.idProfissional
    );
    
    return (
      !isAlreadySelected &&
      (
        (prescriber.nomeProfissional?.toLowerCase() || '').includes(searchTerm) ||
        (prescriber.profissaoProfissional?.toLowerCase() || '').includes(searchTerm) ||
        (prescriber.especialidadeProfissional?.toLowerCase() || '').includes(searchTerm)
      )
    );
  });

  const handleLocationSelect = (location: OrigemDestino) => {
    setFormData(prev => ({
      ...prev,
      idLocal: location.idOrigemDestino
    }));
    setSearchLocation(location.localDeAtendimentoOrigemDestino);
    setIsLocationOpen(false);
  };

  const handlePrescriberSelect = (prescriber: VisitasProfissional) => {
    const isAlreadySelected = selectedPrescribers.some(
      selected => selected.idProfissional === prescriber.idProfissional
    );

    if (!isAlreadySelected) {
      const newSelectedPrescribers = [...selectedPrescribers, prescriber];
      setSelectedPrescribers(newSelectedPrescribers);
      setFormData(prev => ({
        ...prev,
        prescritores: newSelectedPrescribers.map(p => p.idProfissional)
      }));
      setSearchPrescriber('');
    }
  };

  const handleRemovePrescriber = (prescriberId: number) => {
    const newSelectedPrescribers = selectedPrescribers.filter(
      p => p.idProfissional !== prescriberId
    );
    setSelectedPrescribers(newSelectedPrescribers);
    setFormData(prev => ({
      ...prev,
      prescritores: newSelectedPrescribers.map(p => p.idProfissional)
    }));
  };

  const checkAndCreatePrescriberAddressLink = async (idProfissional: number, idOrigemDestino: number, idUsuario: string) => {
    try {
      // 1. Verificar se já existe vínculo para este prescritor
      const existingLinks = await getLinksByProfessionalId(idProfissional);
      
      // 2. Se não existir vínculo ou o vínculo existente não for do usuário atual, criar novo vínculo
      const hasLinkWithCurrentUser = existingLinks?.some(link => 
        link.idUsuario === idUsuario && link.idOrigemDestinoOrigemDestino === idOrigemDestino
      );
      
      if (!hasLinkWithCurrentUser) {
        await createAddressProfessionalLink({
          idProfissional,
          idOrigemDestinoOrigemDestino: idOrigemDestino,
          idUsuario
        });
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao verificar/criar vínculo para o prescritor ${idProfissional}:`, error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // Validações
      if (formData.idLocal === 0) {
        setError('É necessário selecionar um local de atendimento');
        setIsSaving(false);
        return;
      }
      
      if (formData.prescritores.length === 0) {
        setError('É necessário selecionar pelo menos um prescritor');
        setIsSaving(false);
        return;
      }
      
      if (!formData.descricao.trim()) {
        setError('É necessário informar uma descrição para a lista');
        setIsSaving(false);
        return;
      }
      
      // Obter o ID do usuário dos cookies
      const userId = Cookies.get('user_id');
      if (!userId) {
        setError('Não foi possível identificar o usuário. Por favor, faça login novamente.');
        setIsSaving(false);
        return;
      }

      // 1. Salvar a lista principal
      const listaPayload = {
        descricao: formData.descricao,
        idLocal: formData.idLocal,
        idUsuario: userId
      };
      
      const listaSalva = await createLocalPrescritor(listaPayload);
      if (!listaSalva || !listaSalva.id) {
        throw new Error('Não foi possível salvar a lista. Tente novamente.');
      }
      
      // 2. Salvar os prescritores da lista
      const prescritoresSalvos = await Promise.all(
        formData.prescritores.map(async (idPrescritor) => {
          const prescritorListaPayload = {
            idPrescritor,
            idLista: listaSalva.id
          };
          
          return await createPrescriberList(prescritorListaPayload);
        })
      );
      
      // Verificar se todos os prescritores foram salvos com sucesso
      if (prescritoresSalvos.some(p => p === null)) {
        throw new Error('Houve um erro ao salvar alguns prescritores na lista.');
      }
      
      // 3. Verificar e criar vínculos entre prescritores e local para cada prescritor
      await Promise.all(
        formData.prescritores.map(async (idPrescritor) => {
          await checkAndCreatePrescriberAddressLink(idPrescritor, formData.idLocal, userId);
        })
      );
      
      // Se chegou até aqui, tudo foi salvo com sucesso
      toast.success('Lista de visitas criada com sucesso!');
      router.push('/mods/visits/list');
    } catch (error) {
      console.error('Erro ao salvar lista:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar a lista. Tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nova Lista de Visitas</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            required
            className={styles.input}
            placeholder="Digite uma descrição para a lista"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="searchLocation">Local de Atendimento *</label>
          <div className={styles.locationSearch}>
            <input
              type="text"
              id="searchLocation"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onFocus={() => setIsLocationOpen(true)}
              placeholder="Buscar local..."
              className={styles.input}
              required
            />
            {isLocationOpen && (
              <div className={styles.locationDropdown} ref={locationDropdownRef}>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <div
                      key={location.idOrigemDestino}
                      className={styles.locationOption}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className={styles.locationName}>
                        {location.localDeAtendimentoOrigemDestino}
                      </div>
                      <div className={styles.locationDetails}>
                        {location.enderecoOrigemDestino && 
                          <span>{location.enderecoOrigemDestino}</span>
                        }
                        {location.cidadeOrigemDestino && 
                          <span>{location.cidadeOrigemDestino} - {location.ufOrigemDestino}</span>
                        }
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>Nenhum local encontrado</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="searchPrescriber">Prescritores *</label>
          <div className={styles.locationSearch}>
            <input
              type="text"
              id="searchPrescriber"
              value={searchPrescriber}
              onChange={(e) => setSearchPrescriber(e.target.value)}
              onFocus={() => setIsPrescriberOpen(true)}
              placeholder="Buscar prescritor..."
              className={styles.input}
            />
            {isPrescriberOpen && (
              <div className={styles.locationDropdown} ref={prescriberDropdownRef}>
                {filteredPrescribers.length > 0 ? (
                  filteredPrescribers.map((prescriber) => (
                    <div
                      key={prescriber.idProfissional}
                      className={styles.locationOption}
                      onClick={() => handlePrescriberSelect(prescriber)}
                    >
                      <div className={styles.locationName}>
                        {prescriber.nomeProfissional}
                      </div>
                      <div className={styles.locationDetails}>
                        {prescriber.profissaoProfissional && 
                          <span>{prescriber.profissaoProfissional}</span>
                        }
                        {prescriber.especialidadeProfissional && 
                          <span>{prescriber.especialidadeProfissional}</span>
                        }
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>Nenhum prescritor encontrado</div>
                )}
              </div>
            )}
          </div>
          
          {selectedPrescribers.length > 0 && (
            <div className={styles.prescritoresSelected}>
              <h3>Prescritores Selecionados ({selectedPrescribers.length})</h3>
              <ul>
                {selectedPrescribers.map((prescriber) => (
                  <li key={prescriber.idProfissional} className={styles.prescriberItem}>
                    <div className={styles.prescriberInfo}>
                      <span className={styles.prescriberName}>{prescriber.nomeProfissional}</span>
                      <span className={styles.prescriberDetails}>
                        {prescriber.profissaoProfissional} {prescriber.especialidadeProfissional ? `• ${prescriber.especialidadeProfissional}` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemovePrescriber(prescriber.idProfissional)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : 'Salvar Lista'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/agenda-lista')}
            className={styles.cancelButton}
            disabled={isSaving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
