#!/bin/bash

# Script de deploy completo para o sistema SoftOne Tecnovida
# Este script automatiza todo o processo de build, transferência e instalação de dependências

# Configurações
SERVER_IP="192.168.194.23"
SHARE_NAME="softonetecnovidacombr"
MOUNT_POINT="/tmp/softone_mount"
LOCAL_PATH="$(pwd)"
SSH_USER="seu_usuario"  # Usuário SSH para acessar o servidor
SERVER_PATH="/caminho/para/softone"  # Caminho no servidor onde está instalado o sistema

# Cores para mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Iniciando processo completo de deploy do SoftOne ===${NC}"

# Detectar sistema operacional
if [[ "$OSTYPE" == "darwin"* ]]; then
  IS_MAC=true
  echo -e "${YELLOW}Sistema detectado: macOS${NC}"
  MOUNT_POINT="/Volumes/softone_deploy"
else
  IS_MAC=false
  echo -e "${YELLOW}Sistema detectado: Linux/Unix${NC}"
  
  # Verificar se o script está sendo executado como superusuário (Linux)
  if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Este script precisa ser executado como superusuário no Linux (sudo).${NC}"
    exit 1
  fi
fi

# Executar o build
echo -e "${YELLOW}Executando build...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Falha ao executar o build. Corrigindo erros antes de prosseguir.${NC}"
  exit 1
fi
echo -e "${GREEN}Build concluído com sucesso!${NC}"

# Verificar se o ponto de montagem existe, se não, criar
if [ ! -d "$MOUNT_POINT" ]; then
  echo -e "${YELLOW}Criando ponto de montagem em $MOUNT_POINT...${NC}"
  mkdir -p "$MOUNT_POINT"
fi

# Desmontar se já estiver montado
if $IS_MAC; then
  if [ -d "$MOUNT_POINT" ]; then
    echo -e "${YELLOW}Desmontando ponto de montagem existente...${NC}"
    diskutil unmount "$MOUNT_POINT" > /dev/null 2>&1
  fi
else
  if mount | grep -q "$MOUNT_POINT"; then
    echo -e "${YELLOW}Desmontando ponto de montagem existente...${NC}"
    umount "$MOUNT_POINT"
  fi
fi

# Montar o compartilhamento SMB
echo -e "${YELLOW}Montando compartilhamento SMB...${NC}"

if $IS_MAC; then
  echo -e "${YELLOW}Informe sua senha quando solicitado...${NC}"
  mount -t smbfs "//USUARIO:SENHA@$SERVER_IP/$SHARE_NAME" "$MOUNT_POINT"
else
  mount -t cifs "//$SERVER_IP/$SHARE_NAME" "$MOUNT_POINT" -o username=USUARIO,password=SENHA
fi

if [ $? -ne 0 ]; then
  echo -e "${RED}Falha ao montar o compartilhamento SMB. Verifique as credenciais e a conexão de rede.${NC}"
  exit 1
fi
echo -e "${GREEN}Compartilhamento SMB montado com sucesso!${NC}"

# Criar pasta temporária com arquivos essenciais
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}Preparando arquivos para transferência em $TEMP_DIR...${NC}"

# Copiar arquivos essenciais para pasta temporária
cp -R "$LOCAL_PATH/.next" "$TEMP_DIR/"
cp -R "$LOCAL_PATH/public" "$TEMP_DIR/"
cp "$LOCAL_PATH/next.config.js" "$TEMP_DIR/"
cp "$LOCAL_PATH/package.json" "$TEMP_DIR/"
cp "$LOCAL_PATH/package-lock.json" "$TEMP_DIR/"

# Copiar outros arquivos essenciais
if [ -d "$LOCAL_PATH/src" ]; then
  cp -R "$LOCAL_PATH/src" "$TEMP_DIR/"
fi

if [ -f "$LOCAL_PATH/.env.production" ]; then
  cp "$LOCAL_PATH/.env.production" "$TEMP_DIR/.env"
fi

echo -e "${GREEN}Preparação de arquivos concluída!${NC}"

# Contar arquivos a serem transferidos
TOTAL_FILES=$(find "$TEMP_DIR" -type f | wc -l)
echo -e "${YELLOW}Total de arquivos para transferência: $TOTAL_FILES${NC}"

# Verificar se o diretório de destino existe no servidor
echo -e "${YELLOW}Verificando diretório de destino no servidor...${NC}"
if [ ! -d "$MOUNT_POINT/softone" ]; then
  echo -e "${YELLOW}Criando diretório de destino...${NC}"
  mkdir -p "$MOUNT_POINT/softone"
fi

# Transferir arquivos para o servidor
echo -e "${YELLOW}Iniciando transferência de arquivos para o servidor...${NC}"
rsync -av --progress "$TEMP_DIR/" "$MOUNT_POINT/softone/"

if [ $? -ne 0 ]; then
  echo -e "${RED}Falha na transferência de arquivos. Verificando alternativas...${NC}"
  echo -e "${YELLOW}Tentando método alternativo de cópia...${NC}"
  cp -Rv "$TEMP_DIR/"* "$MOUNT_POINT/softone/"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Falha na transferência de arquivos.${NC}"
    # Limpar
    rm -rf "$TEMP_DIR"
    
    if $IS_MAC; then
      diskutil unmount "$MOUNT_POINT" > /dev/null 2>&1
    else
      umount "$MOUNT_POINT"
    fi
    
    exit 1
  fi
fi

echo -e "${GREEN}Transferência de arquivos concluída com sucesso!${NC}"

# Limpeza
echo -e "${YELLOW}Limpando arquivos temporários...${NC}"
rm -rf "$TEMP_DIR"

if $IS_MAC; then
  diskutil unmount "$MOUNT_POINT" > /dev/null 2>&1
else
  umount "$MOUNT_POINT"
fi

# Instalação remota via SSH
echo -e "${YELLOW}Executando instalação de dependências no servidor via SSH...${NC}"
echo -e "${YELLOW}Isso pode levar alguns minutos, por favor aguarde...${NC}"

ssh "$SSH_USER@$SERVER_IP" "cd $SERVER_PATH && npm install --production" 2>&1 | tee /tmp/ssh_output

if [ $? -ne 0 ]; then
  echo -e "${RED}Falha ao instalar dependências no servidor.${NC}"
  echo -e "${RED}Verifique se o acesso SSH está configurado corretamente.${NC}"
  echo -e "${YELLOW}Você pode executar manualmente: ssh $SSH_USER@$SERVER_IP 'cd $SERVER_PATH && npm install --production'${NC}"
else
  echo -e "${GREEN}Dependências instaladas com sucesso!${NC}"
  
  # Verificar se é necessário reiniciar o serviço
  echo -e "${YELLOW}Deseja reiniciar o serviço no servidor? (s/n)${NC}"
  read -r resposta
  
  if [[ "$resposta" =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Reiniciando serviço...${NC}"
    ssh "$SSH_USER@$SERVER_IP" "cd $SERVER_PATH && pm2 restart all" 2>&1 | tee -a /tmp/ssh_output
    
    if [ $? -ne 0 ]; then
      echo -e "${RED}Falha ao reiniciar o serviço.${NC}"
    else
      echo -e "${GREEN}Serviço reiniciado com sucesso!${NC}"
    fi
  fi
fi

echo -e "${GREEN}=== Deploy completo concluído com sucesso! ===${NC}"

exit 0 