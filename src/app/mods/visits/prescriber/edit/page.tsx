"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../register/register.module.css';
import VisitasProfissionaisService, { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';
import { OrigemDestino, getLocations, getLocationByPrescriberId } from '../../../../../services/visits/service_visits_locations';
import { handleCreateTelefone, handleDeleteTelefone, getTelefonesByProfissionalId } from '../../../../../services/visits/service_visits_prescribers_contacts';
import ContactForm from '../components/ContactForm';
import { toast } from 'react-toastify';

interface Contact {
  idTelefone?: number;
  numeroTelefone: string;
  nomeDaSecretariaTelefone: string;
  principal: boolean;
  whatsapp: boolean;
}

interface FormData extends VisitasProfissional {
  frequenciaVisita: number;
  tipoVisita: number;
}

function EditPrescriberContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prescriberId = searchParams.get('id');
  const prescriberIdNumber = prescriberId ? parseInt(prescriberId, 10) : null;

  const [formData, setFormData] = useState<FormData>({
    idProfissional: 0,
    nomeProfissional: '',
    sexoProfissional: '',
    dataNascimentoProfissional: '',
    profissaoProfissional: '',
    especialidadeProfissional: '',
    conselhoProfissional: '',
    numeroConselhoProfissional: '',
    emailProfissional: '',
    idPromotor: '',
    status: true,
    frequenciaVisita: 1,
    tipoVisita: 1
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [locations, setLocations] = useState<OrigemDestino[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!prescriberIdNumber) {
      router.push('/mods/visits/prescriber');
      return;
    }

    async function loadData(id: number) {
      try {
        setLoading(true);
        // Load prescriber data
        const prescriberData = await VisitasProfissionaisService.getVisitasProfissionalById(id);
        if (prescriberData) {
          setFormData(prevData => ({
            ...prevData,
            ...prescriberData,
            frequenciaVisita: prevData.frequenciaVisita,
            tipoVisita: prevData.tipoVisita
          }));

          // Load contacts
          const contactsData = await getTelefonesByProfissionalId(prescriberData.idProfissional);
          setContacts(contactsData.map(contact => ({
            numeroTelefone: contact.numeroTelefone,
            nomeDaSecretariaTelefone: contact.nomeDaSecretariaTelefone,
            principal: contact.principal,
            whatsapp: contact.whatsapp,
            idTelefone: contact.idTelefone
          })));

          // Load location
          const locationData = await getLocationByPrescriberId(prescriberData.idProfissional);
          if (locationData) {
            setSelectedLocation(locationData.idOrigemDestino.toString());
          }
        }

        // Load locations list
        const locationsData = await getLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do prescritor');
      } finally {
        setLoading(false);
      }
    }

    loadData(prescriberIdNumber);
  }, [prescriberIdNumber, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactAdd = async (contact: Contact) => {
    try {
      if (!prescriberIdNumber) return;

      const newContact = await handleCreateTelefone({
        idProfissional: prescriberIdNumber,
        numeroTelefone: contact.numeroTelefone.replace(/\D/g, ''),
        nomeDaSecretariaTelefone: contact.nomeDaSecretariaTelefone || 'Não Informado',
        principal: contact.principal,
        whatsapp: contact.whatsapp
      });

      if (newContact) {
        setContacts(prev => [...prev, {
          ...contact,
          idTelefone: newContact.idTelefone
        }]);
      }
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
    }
  };

  const handleContactRemove = async (index: number) => {
    try {
      const contact = contacts[index];
      if (contact.idTelefone) {
        await handleDeleteTelefone(contact.idTelefone);
        setContacts(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Erro ao remover contato:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prescriberData: VisitasProfissional = {
        idProfissional: formData.idProfissional,
        nomeProfissional: formData.nomeProfissional,
        sexoProfissional: formData.sexoProfissional,
        dataNascimentoProfissional: formData.dataNascimentoProfissional,
        profissaoProfissional: formData.profissaoProfissional,
        especialidadeProfissional: formData.especialidadeProfissional,
        conselhoProfissional: formData.conselhoProfissional,
        numeroConselhoProfissional: formData.numeroConselhoProfissional,
        emailProfissional: formData.emailProfissional,
        idPromotor: formData.idPromotor,
        status: true
      };

      const updatedPrescriber = await VisitasProfissionaisService.updateVisitasProfissional(
        formData.idProfissional,
        prescriberData
      );

      if (!updatedPrescriber) {
        throw new Error('Erro ao atualizar prescritor');
      }

      // Atualizar localização
      if (selectedLocation) {
        await handleUpdateLocation(formData.idProfissional, selectedLocation);
      }

      toast.success('Prescritor atualizado com sucesso!');
      router.push('/mods/visits/prescriber');
    } catch (error) {
      console.error('Erro ao atualizar prescritor:', error);
      toast.error('Erro ao atualizar prescritor');
    }
  };

  const handleUpdateLocation = async (idProfissional: number, idOrigemDestino: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/VisitasProfissionalOrigemDestino/${idProfissional}/${idOrigemDestino}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar localização');
      }
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
      throw error;
    }
  };

  const filteredLocations = locations.filter(location =>
    location.localDeAtendimentoOrigemDestino?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Editar Prescritor</h2>
        <div className={styles.actions}>
          <button type="button" onClick={() => router.push('/mods/visits/prescriber')} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" form="prescriberForm" className={styles.submitButton}>
            Salvar Alterações
          </button>
        </div>
      </div>

      <form id="prescriberForm" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeProfissional" className={styles.label}>Nome Completo</label>
              <input
                type="text"
                id="nomeProfissional"
                name="nomeProfissional"
                value={formData.nomeProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="sexoProfissional" className={styles.label}>Sexo</label>
              <select
                id="sexoProfissional"
                name="sexoProfissional"
                value={formData.sexoProfissional}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="dataNascimentoProfissional" className={styles.label}>Data de Nascimento</label>
              <input
                type="date"
                id="dataNascimentoProfissional"
                name="dataNascimentoProfissional"
                value={formData.dataNascimentoProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="emailProfissional" className={styles.label}>E-mail</label>
              <input
                type="email"
                id="emailProfissional"
                name="emailProfissional"
                value={formData.emailProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informações Profissionais</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="profissaoProfissional" className={styles.label}>Profissão</label>
              <input
                type="text"
                id="profissaoProfissional"
                name="profissaoProfissional"
                value={formData.profissaoProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="especialidadeProfissional" className={styles.label}>Especialidade</label>
              <input
                type="text"
                id="especialidadeProfissional"
                name="especialidadeProfissional"
                value={formData.especialidadeProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="conselhoProfissional" className={styles.label}>Conselho</label>
              <input
                type="text"
                id="conselhoProfissional"
                name="conselhoProfissional"
                value={formData.conselhoProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numeroConselhoProfissional" className={styles.label}>Número do Conselho</label>
              <input
                type="text"
                id="numeroConselhoProfissional"
                name="numeroConselhoProfissional"
                value={formData.numeroConselhoProfissional}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Localização</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="locationSearch" className={styles.label}>Buscar Local</label>
              <input
                type="text"
                id="locationSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
                placeholder="Digite para buscar..."
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="selectedLocation" className={styles.label}>Local de Atendimento</label>
              <select
                id="selectedLocation"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Selecione um local</option>
                {filteredLocations.map((location) => (
                  <option key={location.idOrigemDestino} value={location.idOrigemDestino}>
                    {location.localDeAtendimentoOrigemDestino}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Contatos</h3>
          <ContactForm 
            onAdd={handleContactAdd}
            onRemove={handleContactRemove}
            contacts={contacts}
          />
          <div className={styles.contactsSection}>
            <div className={styles.contactsList}>
              {contacts.map((contact, index) => (
                <div key={index} className={styles.contactItem}>
                  <div className={styles.contactInfo}>
                    <strong>{contact.nomeDaSecretariaTelefone}</strong>
                    <p>{contact.numeroTelefone}</p>
                    <div>
                      {contact.principal && <span>Principal</span>}
                      {contact.whatsapp && <span>WhatsApp</span>}
                    </div>
                  </div>
                  <div className={styles.contactActions}>
                    <button
                      type="button"
                      onClick={() => handleContactRemove(index)}
                      className={styles.deleteButton}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function EditPrescriberPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPrescriberContent />
    </Suspense>
  );
}