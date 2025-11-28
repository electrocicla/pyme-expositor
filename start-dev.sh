#!/bin/bash

# Start Script para Expositor Development
# Este script inicia automáticamente el frontend y worker

set -e

echo "🚀 Iniciando Expositor Development Environment..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar desde la raíz del proyecto"
    exit 1
fi

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
    pnpm install
fi

# Verificar worker dependencies
if [ ! -d "worker/node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependencias del worker...${NC}"
    cd worker
    pnpm install
    cd ..
fi

echo ""
echo -e "${GREEN}✅ Dependencias verificadas${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📍 Expositor Development Environment${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Frontend${NC}"
echo "  URL: ${BLUE}http://localhost:5173${NC}"
echo "  Path: src/"
echo ""
echo -e "${GREEN}Worker${NC}"
echo "  URL: ${BLUE}http://localhost:8787${NC}"
echo "  Path: worker/src/"
echo ""
echo -e "${GREEN}API Proxy${NC}"
echo "  Local: /api → http://localhost:8787"
echo ""
echo -e "${GREEN}Login${NC}"
echo "  Password: ${YELLOW}secretpassword${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener los servidores${NC}"
echo ""

# Iniciar ambos servidores en paralelo
(
    echo -e "${GREEN}[Frontend]${NC} Iniciando en puerto 5173..."
    pnpm dev
) &
FRONTEND_PID=$!

(
    sleep 2  # Esperar a que inicie el frontend
    echo -e "${GREEN}[Worker]${NC} Iniciando en puerto 8787..."
    cd worker
    pnpm dev
) &
WORKER_PID=$!

# Trap para limpiar procesos al salir
trap "kill $FRONTEND_PID $WORKER_PID 2>/dev/null" EXIT

# Esperar a los procesos
wait
