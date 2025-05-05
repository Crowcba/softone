# Scripts de Deploy - SoftOne Tecnovida

Este diretório contém scripts para automatizar o processo de build e deploy do sistema SoftOne para o servidor via compartilhamento SMB.

## Requisitos

Antes de usar os scripts, certifique-se de ter instalado:

- Node.js e npm
- rsync (geralmente já instalado em sistemas Unix/Linux/macOS)
- Para Linux: pacote `cifs-utils` para suporte a montagem SMB
- Para macOS: não são necessários pacotes adicionais
- Para o script completo: acesso SSH configurado ao servidor (preferencialmente com chaves SSH)

## Scripts Disponíveis

### 1. deploy.sh (Linux/Ubuntu)

Script para sistemas Linux que monta o compartilhamento SMB usando `mount -t cifs`.

**Uso:**
```bash
# Tornar o script executável
chmod +x deploy.sh

# Executar (requer permissões de root para montar SMB)
sudo ./deploy.sh
```

### 2. deploy-mac.sh (macOS)

Script otimizado para macOS que usa o formato nativo de montagem SMB do macOS.

**Uso:**
```bash
# Tornar o script executável
chmod +x deploy-mac.sh

# Executar
./deploy-mac.sh
```

### 3. deploy-complete.sh (Multiplataforma)

Script avançado que combina as funcionalidades dos scripts anteriores e adiciona a instalação automática de dependências via SSH após o deploy. Este script detecta automaticamente se você está usando Linux ou macOS e executa o método de montagem apropriado.

**Uso:**
```bash
# Tornar o script executável
chmod +x deploy-complete.sh

# Executar (no Linux, requer sudo)
sudo ./deploy-complete.sh
# ou no macOS
./deploy-complete.sh
```

## Configuração

Antes de usar os scripts, você precisa configurar os seguintes parâmetros nos arquivos:

1. Para todos os scripts, edite e atualize:
   - `SERVER_IP`: endereço IP do servidor (padrão: 192.168.194.23)
   - `SHARE_NAME`: nome do compartilhamento SMB (padrão: softonetecnovidacombr)
   - `USUARIO` e `SENHA`: suas credenciais de acesso ao compartilhamento

2. Para o script completo, configure também:
   - `SSH_USER`: seu usuário SSH no servidor
   - `SERVER_PATH`: caminho completo no servidor onde o projeto está instalado

## O que os scripts fazem

1. Executa o build do projeto usando `npm run build`
2. Monta o compartilhamento SMB do servidor
3. Cria um diretório temporário local
4. Copia todos os arquivos essenciais para o diretório temporário:
   - Pasta `.next` (build)
   - Pasta `public`
   - Arquivos de configuração (next.config.js)
   - Arquivos de dependências (package.json, package-lock.json)
   - Pasta `src` (todo o código-fonte)
   - Arquivos de ambiente (.env.production)
5. Transfere todos os arquivos para o servidor usando rsync
6. Desmonta o compartilhamento e limpa os arquivos temporários

**O script completo faz tudo isso e ainda:**
7. Conecta-se ao servidor via SSH
8. Executa `npm install --production` para instalar dependências
9. Oferece a opção de reiniciar o serviço usando PM2

## Após o Deploy

Depois que o script básico concluir com sucesso, você precisará:

1. Conectar-se ao servidor via SSH
2. Navegar até a pasta do projeto (`cd /caminho/para/softone`)
3. Instalar as dependências: `npm install --production`
4. Reiniciar o serviço do servidor, se necessário

Se você usar o script completo, esses passos são executados automaticamente.

## Configurando o Acesso SSH (para o script completo)

Para usar o script completo, você precisa de acesso SSH ao servidor:

1. Gere um par de chaves SSH se ainda não tiver:
   ```bash
   ssh-keygen -t rsa -b 4096
   ```

2. Copie sua chave pública para o servidor:
   ```bash
   ssh-copy-id seu_usuario@192.168.194.23
   ```

3. Teste o acesso sem senha:
   ```bash
   ssh seu_usuario@192.168.194.23
   ```

## Solução de Problemas

### Falha ao montar o compartilhamento SMB

- Verifique se as credenciais (usuário/senha) estão corretas
- Certifique-se de que o compartilhamento está acessível na rede
- Para Linux: verifique se o pacote `cifs-utils` está instalado

### Erro durante o rsync

- O script tentará usar `cp` como alternativa se o rsync falhar
- Verifique as permissões dos diretórios no servidor

### Permissões 

- No Linux, o script precisa ser executado com sudo para montar SMB
- Verifique se você tem permissões de escrita no compartilhamento

### Problemas com SSH (script completo)

- Verifique se o servidor SSH está acessível: `ssh seu_usuario@192.168.194.23 echo "Teste"`
- Verifique se o caminho do projeto no servidor está correto
- Se estiver usando senha no SSH (não recomendado), o script irá pedir a senha durante a execução

## Personalização

Você pode personalizar os scripts para incluir outros arquivos ou pastas essenciais para seu projeto adicionando mais linhas `cp` na seção de cópia de arquivos. 