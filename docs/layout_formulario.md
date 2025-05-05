# Layout de Formulários - Padrão SoftOne

## Estrutura Básica

### 1. Componente Principal
```typescript
interface FormProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
}
```

### 2. Estados do Formulário
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
const [formData, setFormData] = useState<FormPayload>({
  // campos do formulário
});
```

## Layout Visual

### 1. Cabeçalho
- Botão de voltar no topo
- Título do formulário
- Mensagens de feedback (erro/sucesso)

### 2. Grid Layout
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 20px;
```

### 3. Campos de Formulário
- Campos ocupando largura total (span 2)
- Campos em duas colunas
- Campos individuais

## Estilos Padrão

### 1. Labels
```css
display: block;
margin-bottom: 8px;
font-size: 1rem;
color: #ddd;
font-weight: 500;
```

### 2. Inputs
```css
width: 100%;
padding: 12px 16px;
background-color: #444;
border: 1px solid #555;
border-radius: 8px;
color: white;
font-size: 1rem;
outline: none;
transition: border-color 0.2s ease;
```

## Funcionalidades

### 1. Máscaras de Input
- Implementar funções de formatação para campos específicos
- Exemplo: CEP, telefone, CPF

### 2. Validação
- Campos obrigatórios marcados com *
- Validação de formato
- Feedback visual de erros

### 3. Manipulação de Dados
- Formatação antes do envio
- Tratamento de erros
- Feedback de sucesso

## Boas Práticas

1. **Organização**
   - Agrupar campos relacionados
   - Usar grid para layout responsivo
   - Manter consistência visual

2. **Feedback**
   - Mensagens de erro claras
   - Indicadores de carregamento
   - Confirmação de sucesso

3. **Acessibilidade**
   - Labels associados aos inputs
   - Mensagens de erro acessíveis
   - Contraste adequado

4. **UX**
   - Botões de ação claros
   - Feedback imediato
   - Navegação intuitiva

## Exemplo de Implementação

```typescript
// Estrutura básica do componente
export default function FormComponent({ onSuccess, onCancel }: FormProps) {
  // Estados
  const [formData, setFormData] = useState<FormPayload>({});
  
  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica de mudança
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    // Lógica de submissão
  };
  
  return (
    <div>
      {/* Cabeçalho */}
      <div className="header">
        <button onClick={onCancel}>Voltar</button>
        <h2>Título do Formulário</h2>
      </div>
      
      {/* Mensagens */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Sucesso!</div>}
      
      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Campos do formulário */}
        </div>
      </form>
    </div>
  );
}
```

## Considerações de Responsividade

1. **Mobile First**
   - Grid adaptativo
   - Campos em coluna única em telas pequenas
   - Espaçamento ajustável

2. **Breakpoints**
   - Mobile: < 768px
   - Tablet: 768px - 1024px
   - Desktop: > 1024px

3. **Adaptações**
   - Ajuste de padding/margin
   - Tamanho de fonte responsivo
   - Layout flexível 