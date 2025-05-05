"use client";

import React, { useState } from 'react';
import { getVisitsVehicleService } from "../../../../../services/visits/service_visits_vehicle";
import { VisitsVehicle } from "../../../../../api/visits/visits_vehicle";
import styles from './register.module.css';
import Cookies from 'js-cookie';
import { COOKIE_NAMES } from '../../../../../app/mods/login/login';
import { useRouter } from 'next/navigation';

interface VehicleFormData {
  placaVeiculo: string;
  marcaModeloVeiculo: string;
  modeloVeiculo: string;
  corVeiculo: string;
  proprietarioVeiculo: string;
  ativo: boolean;
}

const initialVehicleFormData: VehicleFormData = {
  placaVeiculo: '',
  marcaModeloVeiculo: '',
  modeloVeiculo: '',
  corVeiculo: '',
  proprietarioVeiculo: '',
  ativo: true
};

export default function RegisterVehiclePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>(initialVehicleFormData);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Verificação básica se o campo está preenchido
      if (!formData.placaVeiculo.trim()) {
        setError('A placa do veículo é obrigatória');
        setLoading(false);
        return;
      }

      const userId = Cookies.get(COOKIE_NAMES.USER_ID);
      
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }

      const vehicleService = await getVisitsVehicleService();
      
      const vehicleData = {
        ...formData,
        idUsuario: userId,
        // Formata a placa para maiúsculas
        placaVeiculo: formData.placaVeiculo.toUpperCase()
      };

      const response = await vehicleService.createVehicle(vehicleData);
      
      if (response) {
        router.push('/mods/visits/vehicles');
      } else {
        throw new Error('Falha ao cadastrar veículo');
      }
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      setError('Erro ao cadastrar veículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Cadastrar Veículo</h2>
        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={() => router.push('/mods/visits/vehicles')} 
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informações do Veículo</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="placaVeiculo">Placa *</label>
              <input
                type="text"
                id="placaVeiculo"
                name="placaVeiculo"
                value={formData.placaVeiculo}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Informe a placa do veículo"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="marcaModeloVeiculo">Marca/Modelo *</label>
              <input
                type="text"
                id="marcaModeloVeiculo"
                name="marcaModeloVeiculo"
                value={formData.marcaModeloVeiculo}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Ex: Ford Ka"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="modeloVeiculo">Modelo</label>
              <input
                type="text"
                id="modeloVeiculo"
                name="modeloVeiculo"
                value={formData.modeloVeiculo}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ex: Sedan, Hatch, SUV"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="corVeiculo">Cor</label>
              <input
                type="text"
                id="corVeiculo"
                name="corVeiculo"
                value={formData.corVeiculo}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ex: Prata, Preto, Branco"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="proprietarioVeiculo">Proprietário</label>
              <input
                type="text"
                id="proprietarioVeiculo"
                name="proprietarioVeiculo"
                value={formData.proprietarioVeiculo}
                onChange={handleChange}
                className={styles.input}
                placeholder="Nome do proprietário"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ativo">Status</label>
              <select
                id="ativo"
                name="ativo"
                value={formData.ativo.toString()}
                onChange={(e) => setFormData({...formData, ativo: e.target.value === 'true'})}
                className={styles.select}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}
