'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getVisitsService } from '@/services/visits/service_visits_locations';
import { visitsLocation, UpdateVisitsLocationPayload } from '@/api/visits/visits_locations';
import { toast } from 'sonner';
import { updateVisitsLocation } from './edit';
import styles from "../table.module.css";

function EditLocationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [location, setLocation] = useState<visitsLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLocation = useCallback(async () => {
    if (!id) return;
    try {
      const service = await getVisitsService();
      const locationData = await service.getLocationById(Number(id));
      if (locationData) {
        setLocation(locationData);
      } else {
        toast.error('Local não encontrado');
        router.push('/mods/visits/locations');
      }
    } catch (_error) {
      toast.error('Erro ao carregar local');
      router.push('/mods/visits/locations');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!id) {
      toast.error('ID não fornecido');
      router.push('/mods/visits/locations');
      return;
    }
    loadLocation();
  }, [id, loadLocation, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!location || !id) return;

    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const payload: UpdateVisitsLocationPayload = {
        idOrigemDestino: location.idOrigemDestino,
        localDeAtendimentoOrigemDestino: formData.get('localDeAtendimentoOrigemDestino') as string,
        enderecoOrigemDestino: formData.get('enderecoOrigemDestino') as string,
        bairroOrigemDestino: formData.get('bairroOrigemDestino') as string,
        cidadeOrigemDestino: formData.get('cidadeOrigemDestino') as string,
        ufOrigemDestino: formData.get('ufOrigemDestino') as string,
        cepOrigemDestino: formData.get('cepOrigemDestino') as string,
        telefoneOrigemDestino: formData.get('telefoneOrigemDestino') as string,
        numeroOrigemDestino: formData.get('numeroOrigemDestino') as string,
        status: formData.get('status') === 'true',
      };

      const updated = await updateVisitsLocation(location.idOrigemDestino, payload);

      if (updated) {
        toast.success('Local atualizado com sucesso');
        router.push('/mods/visits/locations');
      } else {
        toast.error('Erro ao atualizar local');
      }
    } catch (_error) {
      toast.error('Erro ao atualizar local');
    } finally {
      setSaving(false);
    }
  }

  const formLabelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '1rem',
    color: '#ddd',
    fontWeight: 500
  };

  const formInputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#444',
    border: '1px solid #555',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando...</div>;
  }

  if (!location) {
    return <div className={styles.loadingContainer}>Local não encontrado</div>;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <button 
          onClick={() => router.push('/mods/visits/locations')} 
          className={styles.backButton}
        >
          ← Voltar para a lista
        </button>
      </div>
      
      <div className={styles.detailsCard}>
        <h2 className={styles.detailsTitle}>Editar Local de Visita</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ gridColumn: "1 / span 2" }}>
              <label style={formLabelStyle} htmlFor="localNome">Nome do Local *</label>
              <input
                id="localNome"
                type="text"
                name="localDeAtendimentoOrigemDestino"
                defaultValue={location.localDeAtendimentoOrigemDestino}
                style={formInputStyle}
                required
                placeholder="Nome do local de atendimento"
                title="Nome do local de atendimento"
              />
            </div>
            
            <div style={{ gridColumn: "1 / span 1" }}>
              <label style={formLabelStyle} htmlFor="endereco">Endereço *</label>
              <input
                id="endereco"
                type="text"
                name="enderecoOrigemDestino"
                defaultValue={location.enderecoOrigemDestino}
                style={formInputStyle}
                required
                placeholder="Endereço do local"
                title="Endereço do local"
              />
            </div>
            
            <div>
              <label style={formLabelStyle} htmlFor="numero">Número *</label>
              <input
                id="numero"
                type="text"
                name="numeroOrigemDestino"
                defaultValue={location.numeroOrigemDestino || ''}
                style={formInputStyle}
                required
                placeholder="Número"
                title="Número do endereço"
              />
            </div>
            
            <div>
              <label style={formLabelStyle} htmlFor="bairro">Bairro *</label>
              <input
                id="bairro"
                type="text"
                name="bairroOrigemDestino"
                defaultValue={location.bairroOrigemDestino}
                style={formInputStyle}
                required
                placeholder="Bairro"
                title="Bairro"
              />
            </div>
            
            <div>
              <label style={formLabelStyle} htmlFor="cidade">Cidade *</label>
              <input
                id="cidade"
                type="text"
                name="cidadeOrigemDestino"
                defaultValue={location.cidadeOrigemDestino}
                style={formInputStyle}
                required
                placeholder="Cidade"
                title="Cidade"
              />
            </div>
            
            <div>
              <label style={formLabelStyle} htmlFor="uf">UF *</label>
              <input
                id="uf"
                type="text"
                name="ufOrigemDestino"
                defaultValue={location.ufOrigemDestino}
                style={formInputStyle}
                maxLength={2}
                required
                placeholder="UF"
                title="Unidade Federativa (Ex: SP, RJ)"
              />
            </div>
            
            <div>
              <label style={formLabelStyle} htmlFor="cep">CEP *</label>
              <input
                id="cep"
                type="text"
                name="cepOrigemDestino"
                defaultValue={location.cepOrigemDestino}
                style={formInputStyle}
                maxLength={9}
                required
                placeholder="00000-000"
                title="CEP no formato 00000-000"
              />
            </div>
            
            <div>
              <label style={formLabelStyle} htmlFor="telefone">Telefone *</label>
              <input
                id="telefone"
                type="text"
                name="telefoneOrigemDestino"
                defaultValue={location.telefoneOrigemDestino}
                style={formInputStyle}
                maxLength={15}
                required
                placeholder="(00) 00000-0000"
                title="Telefone no formato (00) 00000-0000"
              />
            </div>
            
            <div style={{ gridColumn: "1 / span 2" }}>
              <label style={{ ...formLabelStyle, display: "flex", alignItems: "center", marginTop: "15px" }} htmlFor="status">
                <input
                  id="status"
                  type="checkbox"
                  name="status"
                  defaultChecked={location.status || false}
                  style={{ marginRight: "10px" }}
                  title="Status do local (ativo/inativo)"
                />
                Ativo
              </label>
            </div>
            
            <div style={{ gridColumn: "1 / span 2", marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
              <button 
                type="button"
                onClick={() => router.push('/mods/visits/locations')}
                disabled={saving}
                className={styles.detailsButton}
                style={{ backgroundColor: "#666" }}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className={styles.detailsButton}
                style={{ backgroundColor: "#008C45" }}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default function EditLocationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditLocationContent />
    </Suspense>
  );
}