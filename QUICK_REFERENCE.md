# 🚀 Expositor - Quick Reference

## 📦 Instalación (2 minutos)

```bash
# 1. Instalar dependencias
pnpm install
cd worker && pnpm install && cd ..

# 2. Iniciar desarrollo
pnpm dev          # Terminal 1 - Frontend (5173)
cd worker && pnpm dev  # Terminal 2 - Worker (8787)
```

## 🔑 Credenciales Demo

- **URL**: http://localhost:5173
- **Password**: `secretpassword`

## 📱 Responsive Breakpoints

```
Mobile:  < 640px   (sm)
Tablet:  640-1024px (md-lg)
Desktop: > 1024px   (xl-2xl)
```

## 🎨 Colores Principales

```
Primary:   #3B82F6 (blue-600)
Secondary: #6366F1 (indigo-600)
Neutral:   #0F172A (slate-950)
Error:     #EF4444 (red-500)
Success:   #22C55E (green-500)
```

## 📂 Estructura Principal

```
pyme-expositor/
├── src/                      # Frontend React
│   ├── components/          # Landing, Login, Dashboard
│   ├── services/            # API calls (auth, media)
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript interfaces
│   ├── utils/               # Helpers y utilities
│   ├── App.tsx             # Router principal
│   └── main.tsx            # Entry point
└── worker/                   # Cloudflare Worker
    ├── src/index.ts        # Hono API
    ├── schema.sql          # Database schema
    └── wrangler.jsonc      # Configuración
```

## 🔗 API Endpoints

### Públicos
```
GET  /api/media              # Obtener medios
POST /api/login              # Login
```

### Protegidos (Bearer token)
```
GET    /api/protected/media      # Obtener todos
POST   /api/protected/media      # Subir media
PUT    /api/protected/media/:id  # Editar
DELETE /api/protected/media/:id  # Eliminar
```

## 🧪 Comandos Útiles

```bash
# Development
pnpm dev              # Inicia dev servers
pnpm lint             # Lint código
pnpm run build        # Build producción

# Worker
cd worker && pnpm dev           # Dev worker
cd worker && wrangler deploy    # Deploy

# Database
wrangler d1 execute expositor-db --file schema.sql --local
wrangler d1 execute expositor-db --file schema.sql --remote

# Logs
wrangler tail         # Ver logs en vivo
```

## 💾 Storage

### Archivos
- Frontend: `/dist` (build output)
- Worker: Cloudflare Workers
- Medios: R2 bucket
- DB: D1 Database

### LocalStorage Keys
```
auth-token           # Token JWT
theme-preference     # 'light' | 'dark'
```

## 🔐 Autenticación

### Flow
1. POST `/api/login` con password
2. Recibe token JWT
3. Guarda en localStorage
4. Usa en header: `Authorization: Bearer {token}`

### Token Structure
```json
{
  "user": "owner",
  "exp": 1704067200000
}
```

## 🎯 Componentes Principales

### Landing.tsx
- Navbar con logo
- Hero section
- Carousel de medios
- Contact info
- Theme toggle

### Login.tsx
- Formulario
- Validación
- Error messages
- Loading state

### Dashboard.tsx
- Upload form
- Media grid
- Inline editing
- Delete/View buttons

## 🎨 Utilidades Tailwind

### Spacing
```
p-4   = padding: 1rem
m-4   = margin: 1rem
gap-4 = gap: 1rem
```

### Layout
```
flex items-center justify-between  # Horizontal layout
grid grid-cols-1 sm:grid-cols-2   # Responsive grid
```

### Colores
```
bg-blue-600         # Background
text-slate-900      # Text
border-slate-200    # Border
dark:bg-slate-800   # Dark mode
```

### Estados
```
hover:bg-blue-700   # Hover
focus:ring-2        # Focus
disabled:opacity-50 # Disabled
```

## 📝 TypeScript Patterns

### Interface Tipada
```typescript
interface Media {
  id: number
  title: string
  description: string
  url: string
  type: 'image' | 'video'
}
```

### Service Pattern
```typescript
class MediaService {
  async getMedia(): Promise<Media[]> {
    const response = await fetch('/api/media')
    return response.json()
  }
}
```

### Hook Pattern
```typescript
export const useMyHook = () => {
  const [state, setState] = useState(null)
  
  const action = useCallback(() => {
    // Logic
  }, [])
  
  return { state, action }
}
```

## 🐛 Debugging

### Console Logs
```typescript
console.log('message')
console.error('error')
```

### React DevTools
```
Chrome DevTools > Components tab
```

### Network Tab
```
DevTools > Network > Ver requests
```

### Worker Logs
```bash
wrangler tail --format json
```

## ✨ Clases Tailwind Comunes

### Buttons
```html
<!-- Primary Button -->
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
  Click me
</button>

<!-- Secondary Button -->
<button className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
  Click me
</button>
```

### Cards
```html
<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
  Content
</div>
```

### Input Fields
```html
<input 
  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text"
/>
```

### Grid Responsivo
```html
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <!-- Items -->
</div>
```

## 🔄 Flujo de Datos Típico

```
User Action (click)
    ↓
Event Handler (onClick)
    ↓
Service Call (authService.login)
    ↓
API Request (POST /api/login)
    ↓
Worker Processing
    ↓
Database/Storage Operation
    ↓
Response (token)
    ↓
Update State (setToken)
    ↓
Update UI (navigate)
    ↓
Re-render (React)
```

## 🛡️ Validación Recomendada

### Archivo
```typescript
const validation = validateFile(file, 100 * 1024 * 1024)
if (!validation.valid) {
  console.error(validation.error)
}
```

### Formulario
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!title.trim()) {
    setError('Title is required')
    return
  }
  
  // Proceder
}
```

### API Response
```typescript
if (!response.ok) {
  const error = await response.json() as { error?: string }
  throw new Error(error.error || 'Failed')
}
```

## 📊 Monitoreo en Producción

### Cloudflare Analytics
```
Dashboard → Analytics → Requests
```

### Error Tracking
```bash
wrangler tail --status error
```

### Performance
```
DevTools → Lighthouse
```

## 🚀 Deployment Checklist

- [ ] `pnpm lint` sin errores
- [ ] `pnpm run build` exitoso
- [ ] Variables de entorno configuradas
- [ ] Database schema aplicado
- [ ] R2 bucket creado
- [ ] CORS configurado
- [ ] JWT_SECRET establecido
- [ ] Tests pasando
- [ ] Dominio apuntando a Workers

## 🎓 Recursos Rápidos

- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org)
- [Hono Docs](https://hono.dev)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)

## 📞 Soporte

### Problema: Port ya en uso
```bash
# Cambiar puerto en vite.config.ts
server: {
  port: 5174  // Cambiar número
}
```

### Problema: CORS error
```
Revisar worker/src/index.ts cors() config
```

### Problema: Token expirado
```bash
# Limpiar localStorage
localStorage.clear()
# Re-login
```

### Problema: Database vacía
```bash
wrangler d1 execute expositor-db --file schema.sql --remote
```

## 🎁 Tips Productivos

1. **Usa DevTools de React** - Ver state y props
2. **Usa Network tab** - Ver requests/responses
3. **Usa console.error** - No console.log en prod
4. **Usa Lighthouse** - Auditar performance
5. **Usa ESLint** - Antes de commitear

## 📈 Escalabilidad

### Agregar Funcionalidad
```
1. Crear interface en types/
2. Crear método en services/
3. Usar en component
4. Crear endpoint en worker
5. Usar service desde component
```

### Agregar Nueva Página
```
1. Crear component en components/
2. Agregar route en App.tsx
3. Agregar link en navbar
4. Estilizar con Tailwind
```

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
**¡Listo para usar! 🚀**
