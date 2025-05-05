# Documentação do Layout Base de Telas

## 1. Estrutura de Arquivos

```
📁 src/app/mods/[seu_modulo]/
├── 📄 page.tsx (Página principal)
├── 📄 [seu_modulo].ts (Lógica de filtragem e paginação)
└── 📄 table.module.css (Estilos)
```

## 2. Componentes Principais

### 2.1 Estrutura da Página (page.tsx)

```typescript
// Estados principais necessários
const [items, setItems] = useState<SeuTipo[]>([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState<FilterState>({
  searchTerm: "",
  currentPage: 1,
  itemsPerPage: 10,
  statusFilter: "all"
});
```

### 2.2 Interface de Filtros (seu_modulo.ts)

```typescript
export interface FilterState {
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  statusFilter: "all" | "active" | "inactive";
}
```

## 3. Classes CSS Principais

### 3.1 Container Principal
```css
.pageWrapper {
  background-color: #222;
  padding: 20px;
  min-height: 100vh;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  margin: -20px;
}
```

### 3.2 Cabeçalho
```css
.pageHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.pageTitle {
  font-size: 1.8rem;
  font-weight: 600;
  color: #e5e5e5;
}
```

### 3.3 Container de Busca
```css
.searchContainer {
  display: flex;
  gap: 10px;
  align-items: center;
}
```

### 3.4 Tabela
```css
.tableContainer {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 16px;
  overflow: hidden;
  background: #1e1e1e;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}
```

## 4. Funcionalidades Principais

### 4.1 Filtragem
```typescript
export function filterItems(
  items: SeuTipo[],
  filters: FilterState
): SeuTipo[] {
  return items.filter(item => {
    const matchesSearch = !filters.searchTerm || 
      (item.nome?.toLowerCase() || '')
        .includes(filters.searchTerm.toLowerCase());

    const matchesStatus = filters.statusFilter === "all" 
      ? true 
      : filters.statusFilter === "active" 
        ? item.status === true 
        : item.status === false;

    return matchesSearch && matchesStatus;
  });
}
```

### 4.2 Paginação
```typescript
export function paginateItems(
  items: SeuTipo[],
  page: number,
  itemsPerPage: number
): SeuTipo[] {
  const startIndex = (page - 1) * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
}
```

## 5. Responsividade

### 5.1 Breakpoints Principais
```css
/* Desktop */
@media (min-width: 769px) {
  /* Layout padrão */
}

/* Tablet */
@media (max-width: 768px) {
  .pageHeader {
    flex-direction: column;
    gap: 1rem;
  }
  
  .searchContainer {
    width: 100%;
    flex-direction: column;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .pageTitle {
    font-size: 1.2rem;
  }
  
  .tableCell {
    padding: 0.75rem;
  }
}
```

## 6. Elementos de UI Comuns

### 6.1 Botões
```css
.newButton {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: #008C45;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.backButton {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background: #333;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
```

### 6.2 Status
```css
.statusActive {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: #008C45;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.statusInactive {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  background-color: #CF142B;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}
```

## 7. Dicas de Implementação

1. **Consistência de Cores**:
   - Fundo principal: `#222`
   - Fundo da tabela: `#1e1e1e`
   - Texto principal: `#e5e5e5`
   - Texto secundário: `#a3a3a3`

2. **Espaçamento**:
   - Padding padrão: `1rem`
   - Gap entre elementos: `10px`
   - Margens: `1rem` ou `2rem`

3. **Transições**:
   - Duração: `0.2s`
   - Timing: `ease`

4. **Responsividade**:
   - Sempre implementar versões mobile-first
   - Usar flexbox para layouts adaptáveis
   - Considerar scroll horizontal em tabelas

## 8. Boas Práticas

1. **Organização de Código**:
   - Separar lógica de negócio em arquivos `.ts`
   - Manter estilos em módulos CSS
   - Usar interfaces TypeScript para tipagem

2. **Performance**:
   - Implementar paginação no lado do cliente
   - Usar `useMemo` para cálculos pesados
   - Implementar debounce em campos de busca

3. **Acessibilidade**:
   - Usar tags semânticas HTML
   - Implementar ARIA labels
   - Manter contraste adequado

4. **Manutenção**:
   - Documentar funções complexas
   - Usar constantes para valores mágicos
   - Seguir padrões de nomenclatura consistentes
