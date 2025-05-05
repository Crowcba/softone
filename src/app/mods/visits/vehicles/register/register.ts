import { VisitsVehicle } from "../../../../../api/visits/visits_vehicle";

export interface RegisterVehicleProps {
  onSuccess: (vehicle: VisitsVehicle) => void;
  onCancel: () => void;
}

export interface VehicleFormData {
  placaVeiculo: string;
  marcaModeloVeiculo: string;
  modeloVeiculo: string;
  corVeiculo: string;
  proprietarioVeiculo: string;
  ativo: boolean;
}

export const initialVehicleFormData: VehicleFormData = {
  placaVeiculo: '',
  marcaModeloVeiculo: '',
  modeloVeiculo: '',
  corVeiculo: '',
  proprietarioVeiculo: '',
  ativo: true
};
