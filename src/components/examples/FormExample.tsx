import React, { useState } from 'react';
import {
  FormContainer,
  FormHeader,
  FormButton,
  FormSection,
  FormGrid,
  FormGroup,
  FormLabel,
  FormInput,
  FormDateInput,
  FormSelect,
  FormSelectSearch,
  FormOption,
  FormTextarea,
  FormRadioGroup,
  FormRadio,
  FormInfo,
  FormError
} from '../ui/FormComponents';

type FormData = {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  estado: string;
  cidade: string;
  endereco: string;
  genero: string;
  observacoes: string;
};

const estadosBrasileiros = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 
  'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 
  'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 
  'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 
  'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

// Mapeamento de estados para cidades (exemplo simplificado)
const cidadesPorEstado: Record<string, string[]> = {
  'São Paulo': ['São Paulo', 'Campinas', 'Guarulhos', 'Santos', 'São Bernardo do Campo'],
  'Rio de Janeiro': ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis'],
  'Minas Gerais': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  // Adicione mais estados e cidades conforme necessário
};

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    estado: '',
    cidade: '',
    endereco: '',
    genero: '',
    observacoes: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<string[]>([]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro quando o campo é alterado
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Atualiza as cidades disponíveis quando o estado é alterado
    if (name === 'estado') {
      setFormData(prev => ({ ...prev, cidade: '' }));
      setCidadesDisponiveis(cidadesPorEstado[value] || []);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.genero) newErrors.genero = 'Gênero é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Dados enviados:', formData);
      alert('Formulário enviado com sucesso!');
      
      // Resetar o formulário
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        estado: '',
        cidade: '',
        endereco: '',
        genero: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader 
        title="Cadastro de Usuário" 
        actions={
          <>
            <FormButton type="button" variant="secondary" onClick={() => window.history.back()}>
              Cancelar
            </FormButton>
            <FormButton type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Salvar'}
            </FormButton>
          </>
        }
      />
      
      <FormInfo type="info">
        Preencha todos os campos obrigatórios marcados com (*).
      </FormInfo>
      
      <FormSection title="Informações Pessoais">
        <FormGrid cols={2}>
          <FormGroup>
            <FormLabel htmlFor="nome" required>Nome Completo</FormLabel>
            <FormInput
              id="nome"
              name="nome"
              placeholder="Digite seu nome completo"
              value={formData.nome}
              onChange={handleChange}
            />
            {errors.nome && <FormError>{errors.nome}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="email" required>Email</FormLabel>
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <FormError>{errors.email}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="telefone" required>Telefone</FormLabel>
            <FormInput
              id="telefone"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
            />
            {errors.telefone && <FormError>{errors.telefone}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="dataNascimento" required>Data de Nascimento</FormLabel>
            <FormDateInput
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
            />
            {errors.dataNascimento && <FormError>{errors.dataNascimento}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="genero" required>Gênero</FormLabel>
            <FormRadioGroup
              orientation="horizontal"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
            >
              <FormRadio value="masculino" label="Masculino" />
              <FormRadio value="feminino" label="Feminino" />
              <FormRadio value="outro" label="Outro" />
              <FormRadio value="prefiro-nao-informar" label="Prefiro não informar" />
            </FormRadioGroup>
            {errors.genero && <FormError>{errors.genero}</FormError>}
          </FormGroup>
        </FormGrid>
      </FormSection>
      
      <FormSection title="Endereço">
        <FormGrid cols={2}>
          <FormGroup>
            <FormLabel htmlFor="estado" required>Estado</FormLabel>
            <FormSelect
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <FormOption value="" disabled>Selecione um estado</FormOption>
              {estadosBrasileiros.map(estado => (
                <FormOption key={estado} value={estado}>{estado}</FormOption>
              ))}
            </FormSelect>
            {errors.estado && <FormError>{errors.estado}</FormError>}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="cidade" required>Cidade</FormLabel>
            <FormSelectSearch
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              options={cidadesDisponiveis}
              placeholder="Selecione uma cidade"
              disabled={!formData.estado}
            />
            {errors.cidade && <FormError>{errors.cidade}</FormError>}
          </FormGroup>
          
          <FormGroup fullWidth>
            <FormLabel htmlFor="endereco">Endereço Completo</FormLabel>
            <FormInput
              id="endereco"
              name="endereco"
              placeholder="Rua, número, bairro, complemento"
              value={formData.endereco}
              onChange={handleChange}
            />
          </FormGroup>
        </FormGrid>
      </FormSection>
      
      <FormSection title="Observações">
        <FormGroup>
          <FormLabel htmlFor="observacoes">Observações Adicionais</FormLabel>
          <FormTextarea
            id="observacoes"
            name="observacoes"
            placeholder="Digite aqui quaisquer informações adicionais"
            value={formData.observacoes}
            onChange={handleChange}
            rows={4}
          />
        </FormGroup>
      </FormSection>
    </FormContainer>
  );
};

export default FormExample; 