"use client";

import { useRouter } from 'next/navigation';
import RegisterPrescriber from '../components/RegisterPrescriber';
import { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';

export default function Page() {
  const router = useRouter();

  const handleSuccess = (newPrescriber: VisitasProfissional) => {
    router.push('/mods/visits/prescriber');
  };

  const handleCancel = () => {
    router.push('/mods/visits/prescriber');
  };

  return (
    <RegisterPrescriber
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
