export interface VisitType {
  id: number;
  name: string;
  description: string;
}

export function getVisitTypes(): VisitType[] {
  return [
    {
      id: 1,
      name: 'Presencial',
      description: 'Visita presencial ao local'
    },
    {
      id: 2,
      name: 'Virtual',
      description: 'Visita realizada remotamente'
    },
    {
      id: 3,
      name: 'Híbrida',
      description: 'Visita com componentes presenciais e remotos'
    }
  ];
} 