# Scripts SQL para Otimização da Tabela visitas_profissional

Este documento contém os scripts SQL necessários para otimizar o desempenho das consultas na tabela `visitas_profissional`.

## Criação de Índices

Execute os seguintes scripts no SQL Server para criar índices que melhorarão o desempenho das consultas:

```sql
-- Índice para busca por nome_profissional
CREATE INDEX IX_visitas_profissional_nome ON [dbo].[visitas_profissional] ([nome_profissional]);

-- Índice para busca combinada por especialidade e conselho
CREATE INDEX IX_visitas_profissional_especialidade_conselho ON [dbo].[visitas_profissional] ([especialidade_profissional], [Conselho_profissional]);

-- Índice para busca por promotor
CREATE INDEX IX_visitas_profissional_id_promotor ON [dbo].[visitas_profissional] ([id_promotor]);

-- Índice para busca por status
CREATE INDEX IX_visitas_profissional_status ON [dbo].[visitas_profissional] ([status]);
```

## Benefícios dos Índices

1. **IX_visitas_profissional_nome**: Melhora o desempenho das consultas que filtram pelo nome do profissional, como buscas por nome ou parte do nome.

2. **IX_visitas_profissional_especialidade_conselho**: Otimiza consultas que filtram profissionais por especialidade e conselho, como listar todos os cardiologistas do CRM.

3. **IX_visitas_profissional_id_promotor**: Acelera consultas que filtram por promotor, como listar todos os profissionais associados a um determinado promotor.

4. **IX_visitas_profissional_status**: Melhora o desempenho das consultas que filtram por status (ativo/inativo).

## Observações Importantes

- A criação de índices pode impactar temporariamente o desempenho do sistema durante sua construção.
- Recomenda-se executar estes scripts em horários de baixo uso do sistema.
- Os índices ocupam espaço adicional no banco de dados, mas o ganho de desempenho compensa esse custo. 