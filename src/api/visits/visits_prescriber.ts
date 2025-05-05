export interface visitsPrescriber {
    idPrescriber: number;
    nomePrescriber: string;
    crmPrescriber: string;
    especialidadePrescriber: string;
    status: boolean;
    telefone?: string;
    email?: string;
    observacoes?: string;
    
    idProfissional?: number;
    nomeProfissional?: string;
    sexoProfissional?: string;
    dataNascimentoProfissional?: string;
    profissaoProfissional?: string;
    especialidadeProfissional?: string;
    conselhoProfissional?: string;
    numeroConselhoProfissional?: string;
    emailProfissional?: string;
    idPromotor?: string;
} 