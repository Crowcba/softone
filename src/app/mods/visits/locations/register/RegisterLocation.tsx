"use client";

import React, { useState } from "react";
import { CreateVisitsLocationPayload, visitsLocation } from "../../../../../api/visits/visits_locations";
import { createNewVisitsLocation } from "./register_location";
import styles from "./page.module.scss";

interface RegisterLocationProps {
  onSuccess: (newLocation: visitsLocation) => void;
  onCancel: () => void;
}

export default function RegisterLocation({ onSuccess, onCancel }: RegisterLocationProps) {
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateVisitsLocationPayload>({
    localDeAtendimentoOrigemDestino: '',
    tipo: '',
    enderecoOrigemDestino: '',
    complemento: '',
    bairroOrigemDestino: '',
    cidadeOrigemDestino: '',
    ufOrigemDestino: '',
    cepOrigemDestino: '',
    telefoneOrigemDestino: '',
    numeroOrigemDestino: '',
    nomeContato: '',
    email: '',
    observacoes: '',
    status: true,
  });

  // Função para aplicar máscara ao CEP
  const formatCep = (value: string) => {
    value = value.replace(/\D/g, '');
    if (value.length > 5) {
      return value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    return value;
  };

  // Função para aplicar máscara ao telefone
  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, '');
    
    if (value.length > 10) {
      return '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
    } else if (value.length > 6) {
      return '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6, 10);
    } else if (value.length > 2) {
      return '(' + value.slice(0, 2) + ') ' + value.slice(2);
    }
    
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    let formattedValue = value;
    
    if (name === 'cepOrigemDestino') {
      formattedValue = formatCep(value);
    } else if (name === 'telefoneOrigemDestino') {
      formattedValue = formatPhone(value);
    } else if (name === 'ufOrigemDestino') {
      formattedValue = value.toUpperCase();
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : formattedValue,
    });
  };

  const prepareDataForSubmission = (data: CreateVisitsLocationPayload): CreateVisitsLocationPayload => {
    const formattedData = { ...data };
    
    Object.keys(formattedData).forEach(key => {
      const value = formattedData[key as keyof CreateVisitsLocationPayload];
      if (typeof value === 'string') {
        if (key !== 'telefoneOrigemDestino' && key !== 'cepOrigemDestino') {
          (formattedData as any)[key] = value.toUpperCase();
        }
      }
    });
    
    if (formattedData.cepOrigemDestino) {
      formattedData.cepOrigemDestino = formattedData.cepOrigemDestino.replace(/\D/g, '');
    }
    
    if (formattedData.telefoneOrigemDestino) {
      formattedData.telefoneOrigemDestino = formattedData.telefoneOrigemDestino.replace(/\D/g, '');
    }
    
    return formattedData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    
    try {
      const dataToSubmit = prepareDataForSubmission(formData);
      const result = await createNewVisitsLocation(dataToSubmit);
      
      if (result && result.idOrigemDestino) {
        setAddSuccess(true);
        onSuccess(result);
      } else {
        setAddError('Erro ao criar local de visita. Tente novamente.');
      }
    } catch (error) {
      setAddError('Ocorreu um erro ao processar a solicitação.');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <header className={styles.registerHeader}>
        <button 
          className={styles.backButton}
          onClick={onCancel}
          type="button"
        >
          Voltar
        </button>
        <h2>Cadastrar Local</h2>
      </header>

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <h3>Informações Básicas</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome do Local</label>
              <input
                type="text"
                id="name"
                name="localDeAtendimentoOrigemDestino"
                value={formData.localDeAtendimentoOrigemDestino}
                onChange={handleChange}
                required
                placeholder="Digite o nome do local"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="type">Tipo</label>
              <select
                id="type"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um tipo</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="RESIDENTIAL">Residencial</option>
                <option value="INDUSTRIAL">Industrial</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Endereço</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="street">Rua</label>
              <input
                type="text"
                id="street"
                name="enderecoOrigemDestino"
                value={formData.enderecoOrigemDestino}
                onChange={handleChange}
                required
                placeholder="Digite o nome da rua"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="number">Número</label>
              <input
                type="text"
                id="number"
                name="numeroOrigemDestino"
                value={formData.numeroOrigemDestino}
                onChange={handleChange}
                required
                placeholder="Digite o número"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complement">Complemento</label>
              <input
                type="text"
                id="complement"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Digite o complemento"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="neighborhood">Bairro</label>
              <input
                type="text"
                id="neighborhood"
                name="bairroOrigemDestino"
                value={formData.bairroOrigemDestino}
                onChange={handleChange}
                required
                placeholder="Digite o bairro"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">Cidade</label>
              <input
                type="text"
                id="city"
                name="cidadeOrigemDestino"
                value={formData.cidadeOrigemDestino}
                onChange={handleChange}
                required
                placeholder="Digite a cidade"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="state">Estado</label>
              <input
                type="text"
                id="state"
                name="ufOrigemDestino"
                value={formData.ufOrigemDestino}
                onChange={handleChange}
                maxLength={2}
                required
                placeholder="Digite o estado"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="zipCode">CEP</label>
              <input
                type="text"
                id="zipCode"
                name="cepOrigemDestino"
                value={formData.cepOrigemDestino}
                onChange={handleChange}
                maxLength={9}
                required
                placeholder="Digite o CEP"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Contato</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="contactName">Nome do Contato</label>
              <input
                type="text"
                id="contactName"
                name="nomeContato"
                value={formData.nomeContato}
                onChange={handleChange}
                placeholder="Digite o nome do contato"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="telefoneOrigemDestino"
                value={formData.telefoneOrigemDestino}
                onChange={handleChange}
                maxLength={15}
                required
                placeholder="Digite o telefone"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite o e-mail"
              />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Observações</h3>
          <div className={styles.formGroup}>
            <label htmlFor="observations">Observações</label>
            <textarea
              id="observations"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Digite as observações"
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={`${styles.actionButton} ${styles.cancelButton}`}
            onClick={onCancel}
            disabled={addLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`${styles.actionButton} ${styles.submitButton}`}
            disabled={addLoading}
          >
            {addLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
} 