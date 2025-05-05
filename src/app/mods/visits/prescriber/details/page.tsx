"use client";

import { useRouter } from 'next/navigation';
import PrescriberDetails from '../components/PrescriberDetails';
import { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';

export default function Page() {
  const router = useRouter();
  
  // Mock data for development
  const mockPrescriber: VisitasProfissional = {
    idProfissional: 1,
    nomeProfissional: "Dr. Teste",
    sexoProfissional: "M",
    dataNascimentoProfissional: "1980-01-01",
    profissaoProfissional: "Médico",
    especialidadeProfissional: "Cardiologia",
    conselhoProfissional: "CRM",
    numeroConselhoProfissional: "12345",
    emailProfissional: "dr.teste@example.com",
    idPromotor: "1",
    status: true
  };

  const handleBackClick = () => {
    router.push('/mods/visits/prescriber');
  };

  const handleEditClick = (prescriber: VisitasProfissional) => {
    // Implement edit functionality
  };

  const handleStatusUpdated = async (updatedPrescriber: VisitasProfissional) => {
    // Implement status update functionality
  };

  return (
    <PrescriberDetails
      prescriber={mockPrescriber}
      loading={false}
      onBackClick={handleBackClick}
      onEditClick={handleEditClick}
      onStatusUpdated={handleStatusUpdated}
    />
  );
}
