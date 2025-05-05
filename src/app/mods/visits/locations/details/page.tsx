"use client";

import { useRouter } from 'next/navigation';
import LocationDetails from './LocationDetails';
import { visitsLocation } from '../../../../../api/visits/visits_locations';

export default function Page() {
  const router = useRouter();
  
  // Mock data for development
  const mockLocation: visitsLocation = {
    idOrigemDestino: 1,
    localDeAtendimentoOrigemDestino: "Local de Teste",
    enderecoOrigemDestino: "Rua Teste",
    bairroOrigemDestino: "Bairro Teste",
    cidadeOrigemDestino: "Cidade Teste",
    ufOrigemDestino: "TS",
    cepOrigemDestino: "12345-678",
    telefoneOrigemDestino: "(11) 99999-9999",
    numeroOrigemDestino: "123",
    status: true
  };

  const handleBackClick = () => {
    router.push('/mods/visits/locations');
  };

  const handleEditClick = (location: visitsLocation) => {
    // Implement edit functionality
  };

  const handleStatusUpdated = (updatedLocation: visitsLocation) => {
    // Implement status update functionality
  };

  return (
    <LocationDetails
      location={mockLocation}
      loading={false}
      onBackClick={handleBackClick}
      onEditClick={handleEditClick}
      onStatusUpdated={handleStatusUpdated}
    />
  );
}
