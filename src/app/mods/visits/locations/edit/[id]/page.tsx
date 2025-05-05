'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getVisitsService } from '@/services/visits/service_visits_locations';
import { visitsLocation, UpdateVisitsLocationPayload } from '@/api/visits/visits_locations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { updateVisitsLocation } from '../edit';

interface EditLocationPageProps {
  params: {
    id: string;
  };
}

export default function EditLocationPage({ params }: EditLocationPageProps) {
  const router = useRouter();
  const { id } = params;
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!location) {
    return <div>Local não encontrado</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Local de Visita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="localDeAtendimentoOrigemDestino">Local de Atendimento</Label>
          <Input
            id="localDeAtendimentoOrigemDestino"
            name="localDeAtendimentoOrigemDestino"
            defaultValue={location.localDeAtendimentoOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="enderecoOrigemDestino">Endereço</Label>
          <Input
            id="enderecoOrigemDestino"
            name="enderecoOrigemDestino"
            defaultValue={location.enderecoOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="bairroOrigemDestino">Bairro</Label>
          <Input
            id="bairroOrigemDestino"
            name="bairroOrigemDestino"
            defaultValue={location.bairroOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="cidadeOrigemDestino">Cidade</Label>
          <Input
            id="cidadeOrigemDestino"
            name="cidadeOrigemDestino"
            defaultValue={location.cidadeOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="ufOrigemDestino">UF</Label>
          <Input
            id="ufOrigemDestino"
            name="ufOrigemDestino"
            defaultValue={location.ufOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="cepOrigemDestino">CEP</Label>
          <Input
            id="cepOrigemDestino"
            name="cepOrigemDestino"
            defaultValue={location.cepOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="telefoneOrigemDestino">Telefone</Label>
          <Input
            id="telefoneOrigemDestino"
            name="telefoneOrigemDestino"
            defaultValue={location.telefoneOrigemDestino}
            required
          />
        </div>

        <div>
          <Label htmlFor="numeroOrigemDestino">Número</Label>
          <Input
            id="numeroOrigemDestino"
            name="numeroOrigemDestino"
            defaultValue={location.numeroOrigemDestino || ''}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            name="status"
            defaultChecked={location.status || false}
            value="true"
          />
          <Label htmlFor="status">Ativo</Label>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/mods/visits/locations')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
