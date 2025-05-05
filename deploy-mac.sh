#!/bin/bash

# Script de deploy para o sistema SoftOne Tecnovida (versão macOS)
# Este script automatiza o processo de build e transferência de arquivos para o servidor via SMB

# Configurações
SERVER_IP="192.168.194.23"
SHARE_NAME="softonetecnovidacombr"
MOUNT_POINT="/Volumes/softone_deploy"
LOCAL_PATH="$(pwd)"
BUILD_FOLDER="$LOCAL_PATH/.next"

# Cores para mensagens
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Iniciando processo de deploy do SoftOne (macOS) ===${NC}"

# Executar o build
echo -e "${YELLOW}Executando build...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Falha ao executar o build. Corrigindo erros antes de prosseguir.${NC}"
  exit 1
fi
echo -e "${GREEN}Build concluído com sucesso!${NC}"

# Desmontar se já estiver montado
if [ -d "$MOUNT_POINT" ]; then
  echo -e "${YELLOW}Desmontando ponto de montagem existente...${NC}"
  diskutil unmount "$MOUNT_POINT" > /dev/null 2>&1
fi

# Verificar se o ponto de montagem existe, se não, criar
if [ ! -d "$MOUNT_POINT" ]; then
  echo -e "${YELLOW}Criando ponto de montagem em $MOUNT_POINT...${NC}"
  mkdir -p "$MOUNT_POINT"
fi

# Montar o compartilhamento SMB (modo macOS)
echo -e "${YELLOW}Montando compartilhamento SMB...${NC}"
echo -e "${YELLOW}Informe sua senha quando solicitado...${NC}"
mount -t smbfs "//USUARIO:SENHA@$SERVER_IP/$SHARE_NAME" "$MOUNT_POINT"

if [ $? -ne 0 ]; then
  echo -e "${RED}Falha ao montar o compartilhamento SMB. Verifique as credenciais e a conexão de rede.${NC}"
  echo -e "${YELLOW}Você também pode montar manualmente pelo Finder:${NC}"
  echo -e "  1. Abra o Finder"
  echo -e "  2. Pressione Cmd+K"
  echo -e "  3. Digite smb://$SERVER_IP/$SHARE_NAME"
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
    diskutil unmount "$MOUNT_POINT" > /dev/null 2>&1
    exit 1
  fi
fi

echo -e "${GREEN}Transferência de arquivos concluída com sucesso!${NC}"

# Limpeza
echo -e "${YELLOW}Limpando arquivos temporários...${NC}"
rm -rf "$TEMP_DIR"
diskutil unmount "$MOUNT_POINT" > /dev/null 2>&1

echo -e "${GREEN}=== Deploy concluído com sucesso! ===${NC}"
echo -e "${YELLOW}IMPORTANTE: Execute 'npm install --production' no servidor para instalar as dependências.${NC}"
echo -e "${YELLOW}Comando SSH de exemplo: ssh usuario@$SERVER_IP 'cd /caminho/para/softone && npm install --production'${NC}"

exit 0 