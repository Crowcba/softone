import { VisitasProfissional } from '../../../../../services/visits/service_visits_prescribers';
import { visitsLocation } from "../../../../../api/visits/visits_locations";

export interface RegisterVisitFormData {
  prescriber: VisitasProfissional | null;
  location: string;
  date: string;
  period: 'morning' | 'afternoon';
  type: string;
  description: string;
}

export interface RegisterVisitFormProps {
  initialData?: RegisterVisitFormData;
  onSubmit: (data: RegisterVisitFormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export interface VisitType {
  id: string;
  name: string;
}

export interface PrescriberOption {
  value: string;
  label: string;
}

export interface LocationOption {
  value: string;
  label: string;
  location: visitsLocation;
} 