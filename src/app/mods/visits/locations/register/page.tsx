"use client";

import { useRouter } from 'next/navigation';
import RegisterLocation from './RegisterLocation';
import { visitsLocation } from '../../../../../api/visits/visits_locations';

export default function Page() {
  const router = useRouter();

  const handleSuccess = (newLocation: visitsLocation) => {
    router.push('/mods/visits/locations');
  };

  const handleCancel = () => {
    router.push('/mods/visits/locations');
  };

  return (
    <RegisterLocation
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
