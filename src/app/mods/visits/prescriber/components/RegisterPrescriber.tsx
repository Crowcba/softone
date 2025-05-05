"use client";

import React, { useState, useEffect } from 'react';
import { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';
import VisitasProfissionaisService from '../../../../../services/visits/service_visits_prescribers';
import styles from '../register/register.module.css';
import ContactForm from './ContactForm';
import Cookies from 'js-cookie';
import { getUserId } from '@/app/mods/login/login';

interface Contact {
  numeroTelefone: string;
  nomeDaSecretariaTelefone: string;
  principal: boolean;
  whatsapp: boolean;
}

interface RegisterPrescriberProps {
  onSuccess: (newPrescriber: VisitasProfissional) => void;
  onCancel: () => void;
}

export default function RegisterPrescriber({ onSuccess, onCancel }: RegisterPrescriberProps) {
  const [formData, setFormData] = useState<Omit<VisitasProfissional, 'idProfissional'>>({
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
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user_id from cookie when component mounts
  useEffect(() => {
    // Get the user ID from the cookie
    const userId = getUserId();
    
    if (userId) {
      setFormData(prev => ({ ...prev, idPromotor: userId }));
    } else {
      console.warn('User ID not found in cookies');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleContactAdd = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const handleContactRemove = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate only required fields (just the name)
    if (!formData.nomeProfissional.trim()) {
      setError('O nome do profissional é obrigatório.');
      setLoading(false);
      return;
    }

    try {
      // Prepare form data with default values for empty fields
      const preparedData = {
        ...formData,
        // For string fields, use "não informado" if empty
        nomeProfissional: formData.nomeProfissional.trim(),
        sexoProfissional: formData.sexoProfissional.trim() || "não informado",
        dataNascimentoProfissional: formData.dataNascimentoProfissional || "não informado",
        profissaoProfissional: formData.profissaoProfissional.trim() || "não informado",
        especialidadeProfissional: formData.especialidadeProfissional.trim() || "não informado",
        conselhoProfissional: formData.conselhoProfissional.trim() || "não informado",
        numeroConselhoProfissional: formData.numeroConselhoProfissional.trim() || "não informado",
        emailProfissional: formData.emailProfissional.trim() || "não informado",
        // For numeric fields, use 0 if not provided
        idConselho: 0,
        idEstadoConselho: 0
      };

      const result = await VisitasProfissionaisService.createVisitasProfissional(preparedData);

      if (result && result.idProfissional) {
        onSuccess(result);
      } else {
        setError('Erro ao criar profissional. Tente novamente.');
      }
    } catch (error) {
      setError('Ocorreu um erro ao processar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={onCancel}
          type="button"
        >
          Voltar
        </button>
        <h2>Cadastrar Profissional</h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informações Básicas</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome do Profissional*</label>
              <input
                type="text"
                id="name"
                name="nomeProfissional"
                value={formData.nomeProfissional}
                onChange={handleInputChange}
                required
                placeholder="Digite o nome do profissional"
              />
              <small className={styles.helperText}>* Campo obrigatório</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="sex">Sexo</label>
              <select
                id="sex"
                name="sexoProfissional"
                value={formData.sexoProfissional}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="birthDate">Data de Nascimento</label>
              <input
                type="date"
                id="birthDate"
                name="dataNascimentoProfissional"
                value={formData.dataNascimentoProfissional}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="profession">Profissão</label>
              <input
                type="text"
                id="profession"
                name="profissaoProfissional"
                value={formData.profissaoProfissional}
                onChange={handleInputChange}
                placeholder="Digite a profissão"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="specialty">Especialidade</label>
              <input
                type="text"
                id="specialty"
                name="especialidadeProfissional"
                value={formData.especialidadeProfissional}
                onChange={handleInputChange}
                placeholder="Digite a especialidade"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="council">Conselho</label>
              <input
                type="text"
                id="council"
                name="conselhoProfissional"
                value={formData.conselhoProfissional}
                onChange={handleInputChange}
                placeholder="Digite o conselho"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="councilNumber">Número do Conselho</label>
              <input
                type="text"
                id="councilNumber"
                name="numeroConselhoProfissional"
                value={formData.numeroConselhoProfissional}
                onChange={handleInputChange}
                placeholder="Digite o número do conselho"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="emailProfissional"
                value={formData.emailProfissional}
                onChange={handleInputChange}
                placeholder="Digite o email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="promoter">ID do Promotor</label>
              <input
                type="text"
                id="promoter"
                name="idPromotor"
                value={formData.idPromotor}
                onChange={handleInputChange}
                readOnly
                disabled
                className={styles.disabledInput}
              />
              <small className={styles.helperText}>Preenchido automaticamente com seu ID</small>
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
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onCancel}
            className={`${styles.button} ${styles.cancelButton}`}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
} 