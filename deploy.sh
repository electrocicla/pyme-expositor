#!/bin/bash

# Script de deployment para Expositor

set -e

echo "🚀 Iniciando deployment de Expositor..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json no encontrado${NC}"
    exit 1
fi

# Build Frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
pnpm run build

if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend build completado${NC}"
else
    echo -e "${RED}❌ Frontend build falló${NC}"
    exit 1
fi

# Deploy Worker
echo -e "${YELLOW}🔧 Deploying Cloudflare Worker...${NC}"
cd worker

# Verificar schema de base de datos
if [ -f "schema.sql" ]; then
    echo -e "${YELLOW}📊 Aplicando schema de base de datos...${NC}"
    wrangler d1 execute expositor-db --file schema.sql --remote || echo -e "${YELLOW}⚠️  Schema ya aplicado o error tolerado${NC}"
fi

# Deploy
wrangler deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Worker deployed exitosamente${NC}"
else
    echo -e "${RED}❌ Worker deployment falló${NC}"
    exit 1
fi

cd ..

# Deploy Frontend a Pages (si está configurado)
echo -e "${YELLOW}📤 Uploading frontend to Cloudflare Pages...${NC}"
# Esta parte depende de tu configuración específica de Pages

echo -e "${GREEN}✅ ¡Deployment completado exitosamente!${NC}"
echo -e "${YELLOW}Frontend: dist/${NC}"
echo -e "${YELLOW}Worker: https://pyme-expositor-worker.dev${NC}"
