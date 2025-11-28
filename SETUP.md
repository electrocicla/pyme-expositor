# Expositor - Guía de Instalación y Configuración

## 📋 Requisitos Previos

- **Node.js**: 18.0.0 o superior
- **pnpm**: 8.0.0 o superior (recomendado)
- **Git**: Para control de versiones
- **Cuenta Cloudflare**: Para Worker y R2
- **Wrangler CLI**: `npm install -g wrangler`

## ⚡ Instalación Rápida

### 1. Clonar Repositorio

```bash
git clone https://github.com/electrocicla/pyme-expositor.git
cd pyme-expositor
```

### 2. Instalar Dependencias

```bash
# Frontend
pnpm install

# Worker
cd worker && pnpm install && cd ..
```

### 3. Configurar Variables de Entorno

```bash
# En worker/wrangler.jsonc
cp worker/wrangler.jsonc.example worker/wrangler.jsonc
```

Editar `worker/wrangler.jsonc`:
```json
{
  "vars": {
    "JWT_SECRET": "tu-secreto-seguro-aqui-cambiar-en-produccion"
  }
}
```

### 4. Iniciar en Desarrollo

**Terminal 1 - Frontend**:
```bash
pnpm dev
```

**Terminal 2 - Worker**:
```bash
cd worker && pnpm dev
```

Frontend estará en: `http://localhost:5173`
Worker estará en: `http://localhost:8787`

## 🗄️ Configuración de Base de Datos

### Crear Base de Datos D1

```bash
cd worker
wrangler d1 create expositor-db
```

Copiar el `database_id` y actualizar en `wrangler.jsonc`.

### Aplicar Schema

```bash
wrangler d1 execute expositor-db --file schema.sql --local
```

Para sincronizar con producción:
```bash
wrangler d1 execute expositor-db --file schema.sql --remote
```

## 📁 Configurar Storage R2

### Crear Bucket R2

```bash
wrangler r2 bucket create expositor-storage
```

Actualizar en `wrangler.jsonc`:
```json
{
  "r2_buckets": [
    {
      "bucket_name": "expositor-storage",
      "binding": "expositor_storage"
    }
  ]
}
```

## 🔐 Configurar Autenticación

### Cambiar Contraseña (Desarrollo)

En `worker/src/index.ts`:
```typescript
if (password === 'tu-contraseña-nueva') {
  // Login exitoso
}
```

### Para Producción (Recomendado)

Implementar hash seguro:
```bash
pnpm add bcryptjs
```

```typescript
import bcrypt from 'bcryptjs'

const passwordHash = bcrypt.hashSync(password, 10)
const isValid = bcrypt.compareSync(password, storedHash)
```

## 🌐 Variables de Entorno

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8787
VITE_APP_NAME=Expositor
```

### Worker (worker/wrangler.jsonc)

```jsonc
{
  "vars": {
    "JWT_SECRET": "your-secret-key",
    "ENVIRONMENT": "development"
  },
  "env": {
    "production": {
      "vars": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

## 🚀 Deployment

### Paso 1: Build Frontend

```bash
pnpm run build
```

Esto generará la carpeta `dist/` con los archivos optimizados.

### Paso 2: Deploy Worker

```bash
cd worker
wrangler deploy
```

### Paso 3: Deploy Frontend a Pages

#### Opción A: Automático con Git

1. Conectar repositorio a Cloudflare Pages
2. Configurar build command: `pnpm run build`
3. Output directory: `dist`

#### Opción B: Manual

```bash
npx wrangler pages deploy dist --project-name=pyme-expositor
```

### Paso 3: Configurar Dominio

1. Ir a Cloudflare Dashboard
2. Pages → pyme-expositor
3. Configurar dominio personalizado

## 🔗 Conectar Frontend a Worker

En `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://your-worker-name.your-domain.com',
      changeOrigin: true
    }
  }
}
```

## 🛡️ Seguridad

### CORS Configuración

En `worker/src/index.ts`:
```typescript
app.use('*', cors({
  origin: ['https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))
```

### Rate Limiting (Recomendado)

```bash
pnpm add hono-rate-limiter
```

## 📊 Monitoreo

### Cloudflare Analytics

Habilitado automáticamente en `wrangler.jsonc`:
```json
{
  "observability": {
    "enabled": true
  }
}
```

Ver logs:
```bash
wrangler tail
```

### Ver Logs en Tiempo Real

```bash
wrangler tail --format json
```

## 🧪 Testing

### Lint

```bash
pnpm lint
```

### Type Check

```bash
pnpm run build
```

### Local Development Test

```bash
# Terminal 1
pnpm dev

# Terminal 2
cd worker && pnpm dev

# Terminal 3
curl http://localhost:5173  # Frontend
curl http://localhost:8787/api/media  # Worker
```

## 🔄 Backup y Recuperación

### Backup de Base de Datos

```bash
wrangler d1 execute expositor-db --command "SELECT * FROM media" > backup.json
```

### Restore de Base de Datos

```bash
# Usar schema.sql y repobular manualmente
```

### Backup de Storage

```bash
# Descargar todos los archivos de R2
aws s3 sync s3://expositor-storage ./backup/storage
```

## 🐛 Troubleshooting

### Error: "Cannot connect to Worker"

- Verificar que el worker está corriendo: `wrangler dev`
- Comprobar URL en vite.config.ts
- Revisar CORS en worker

### Error: "Database not found"

```bash
# Verificar ID en wrangler.jsonc
wrangler d1 list
```

### Error: "R2 bucket not found"

```bash
# Listar buckets
wrangler r2 bucket list
```

### Error: "Authentication failed"

- Verificar token en localStorage
- Comprobar JWT_SECRET en wrangler.jsonc
- Revisar que token no está expirado

### Error: "CORS Policy blocked"

- Verificar origins en cors() middleware
- Incluir dominio en whitelist
- Probar con `http://localhost` en desarrollo

## 📚 Documentación Adicional

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [D1 Database](https://developers.cloudflare.com/d1)
- [R2 Storage](https://developers.cloudflare.com/r2)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler)
- [Hono Framework](https://hono.dev)

## 🆘 Soporte

Para issues:
1. Revisar [DEVELOPMENT.md](./DEVELOPMENT.md)
2. Comprobar logs: `wrangler tail`
3. Crear issue en GitHub

## ✅ Checklist de Producción

- [ ] JWT_SECRET configurado
- [ ] Base de datos schema aplicado
- [ ] R2 bucket creado
- [ ] CORS configurado
- [ ] Dominio conectado
- [ ] SSL/TLS habilitado
- [ ] Analytics habilitado
- [ ] Backups configurados
- [ ] Tests pasando
- [ ] Build sin warnings

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
