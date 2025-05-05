"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { getVisitsVehicleService } from "../../../../../services/visits/service_visits_vehicle";
import { VisitsVehicle } from "../../../../../api/visits/visits_vehicle";
import styles from './edit.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

interface VehicleFormData {
  placaVeiculo: string;
  marcaModeloVeiculo: string;
  modeloVeiculo: string;
  corVeiculo: string;
  proprietarioVeiculo: string;
  ativo: boolean;
}

const emptyVehicleFormData: VehicleFormData = {
  placaVeiculo: '',
  marcaModeloVeiculo: '',
  modeloVeiculo: '',
  corVeiculo: '',
  proprietarioVeiculo: '',
  ativo: true,
};

function EditVehicleContent() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>(emptyVehicleFormData);
  const [vehicleId, setVehicleId] = useState<number | null>(null);
  const [originalUserData, setOriginalUserData] = useState<{
    idUsuario?: string;
    idUsername?: string;
  }>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadVehicle() {
      try {
        setLoading(true);
        const id = searchParams.get('id');
        
        if (!id) {
          setError('ID do veículo não especificado');
          return;
        }
        
        const vehicleService = await getVisitsVehicleService();
        const vehicle = await vehicleService.getVehicleById(parseInt(id));
        
        if (!vehicle) {
          setError('Veículo não encontrado');
          return;
        }
        
        setVehicleId(vehicle.idVeiculo);
        setOriginalUserData({
          idUsuario: vehicle.idUsuario,
          idUsername: vehicle.idUsername
        });
        
        setFormData({
          placaVeiculo: vehicle.placaVeiculo || '',
          marcaModeloVeiculo: vehicle.marcaModeloVeiculo || '',
          modeloVeiculo: vehicle.modeloVeiculo || '',
          corVeiculo: vehicle.corVeiculo || '',
          proprietarioVeiculo: vehicle.proprietarioVeiculo || '',
          ativo: vehicle.ativo
        });
      } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        setError('Erro ao carregar dados do veículo. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!vehicleId) {
        throw new Error('ID do veículo não encontrado');
      }

      if (!formData.placaVeiculo.trim()) {
        setError('A placa do veículo é obrigatória');
        setSubmitting(false);
        return;
      }

      const vehicleService = await getVisitsVehicleService();
      
      const vehicleData = {
        ...formData,
        idUsuario: originalUserData.idUsuario,
        idUsername: originalUserData.idUsername,
        placaVeiculo: formData.placaVeiculo.toUpperCase()
      };

      const response = await vehicleService.updateVehicle(vehicleId, vehicleData);
      
      if (response) {
        router.push('/mods/visits/vehicles');
      } else {
        throw new Error('Falha ao atualizar veículo');
      }
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      setError('Erro ao atualizar veículo. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Editar Veículo</h2>
        <div className={styles.actions}>
          <button 
            type="button" 
            onClick={() => router.push('/mods/visits/vehicles')} 
            className={styles.cancelButton}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar'}
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

export default function EditVehiclePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditVehicleContent />
    </Suspense>
  );
}
