# Expositor - Guía de Desarrollo

## 🎯 Arquitectura

### Frontend
- **React 19.1** con Hooks
- **TypeScript** strict mode (sin tipos `any`)
- **Tailwind CSS v4** (solo utilities, sin `@apply`)
- **Swiper** para carousels
- **React Router v7.6** para navegación

### Backend (Worker)
- **Hono** para routing
- **Cloudflare Workers** como runtime
- **D1 Database** para persistencia
- **R2 Storage** para archivos

## 📐 Estructura de Carpetas

```
src/
├── components/           # Componentes React
│   ├── Landing.tsx      # Página principal
│   ├── Login.tsx        # Formulario de login
│   ├── Dashboard.tsx    # Panel admin
│   └── ThemeProvider.tsx # Context de tema
├── hooks/               # Custom hooks
│   └── index.ts
├── services/            # Servicios API
│   ├── auth.ts
│   ├── media.ts
│   └── index.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── utils/               # Utilidades
│   ├── api.ts          # Helpers API y storage
│   └── index.ts
├── App.tsx             # Router principal
├── main.tsx            # Entry point
└── index.css           # Estilos globales
```

## 🔄 Flujo de Datos

```
Landing (Pública)
  ├── mediaService.getPublicMedia()
  └── Renderiza galería Swiper

Login
  ├── authService.login(password)
  └── Guarda token en localStorage

Dashboard (Protegida)
  ├── Verifica autenticación
  ├── mediaService.getProtectedMedia()
  ├── POST/PUT/DELETE operations
  └── Actualiza estado local
```

## 🎨 Sistema de Estilos

### Breakpoints Tailwind
```typescript
sm:  // 640px  - Tablets
md:  // 768px  - Tablets grandes
lg:  // 1024px - Desktops
xl:  // 1280px - Desktops grandes
2xl: // 1536px - Full HD
```

### Colores
```
Blue:    #3B82F6 (primary)
Indigo:  #6366F1 (secondary)
Slate:   #0F172A (neutral)
Red:     #EF4444 (error)
Green:   #22C55E (success)
```

### Modo Oscuro
- Light: Automático al theme-preference
- Dark: Automático según prefers-color-scheme
- Toggle: Botón en header

## 🔐 Autenticación

### Token JWT (Simple)
```typescript
{
  user: 'owner',
  exp: timestamp
}
```

### Headers Requeridos
```
Authorization: Bearer {token}
Content-Type: application/json
```

## 📱 Responsive Design

### Mobile First Approach
1. Base styles para mobile (320px)
2. Enhancers con `sm:`, `md:`, etc.
3. Touch-friendly tap targets (44x44px mínimo)

### Grid Responsivo
```typescript
// Landing
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4

// Dashboard
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
```

## 🚀 Performance

### Image Optimization
```tsx
<img
  src={url}
  alt={title}
  className="w-full h-full object-cover"
  loading="lazy"  // Lazy loading nativo
/>
```

### Code Splitting
- Automático por ruta en React Router
- Async imports soportados

### Bundle Size
- Tailwind: ~15KB (purged)
- React: ~40KB
- Hono: ~5KB

## 🧪 Testing

### Lint
```bash
pnpm lint
```

### TypeScript Check
```bash
tsc --noEmit
```

### Build
```bash
pnpm build
```

## 🔧 Extensiones Comunes

### Agregar Nueva Página

```typescript
// src/components/NewPage.tsx
import { useTheme } from './ThemeProvider'

export default function NewPage() {
  const { theme } = useTheme()
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-800">
      {/* Content */}
    </div>
  )
}
```

Luego en `App.tsx`:
```typescript
<Route path="/new-page" element={<NewPage />} />
```

### Agregar API Endpoint

En `worker/src/index.ts`:
```typescript
app.get('/api/new-endpoint', async (c) => {
  try {
    // Logic aquí
    return c.json({ data: result })
  } catch (error) {
    return c.json({ error: 'Failed' }, 500)
  }
})
```

### Agregar Custom Hook

```typescript
// src/hooks/useMyFeature.ts
import { useState, useCallback } from 'react'

export const useMyFeature = () => {
  const [state, setState] = useState(null)

  const action = useCallback(() => {
    // Logic
  }, [])

  return { state, action }
}
```

### Agregar Servicio

```typescript
// src/services/myService.ts
class MyService {
  async getData() {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed')
    return response.json()
  }
}

export const myService = new MyService()
```

## 🐛 Debugging

### Frontend
- DevTools de React
- Console logs
- Network tab

### Worker
```bash
wrangler tail  # Ver logs en tiempo real
```

### Database
```bash
wrangler d1 execute expositor-db --command "SELECT * FROM media" --remote
```

## 📚 Recursos Útiles

### Documentación Oficial
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Hono Guide](https://hono.dev/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)

### Herramientas
- [Vite Docs](https://vitejs.dev)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler)
- [Swiper API](https://swiperjs.com/swiper-api)

## 🎯 Mejores Prácticas

### TypeScript
✅ Siempre tipear props y returns
✅ Usar interfaces para shapes complejos
✅ Evitar `any` y `as any`
❌ No usar tipos implícitos en funciones

### React
✅ Usar hooks modernos
✅ Memoizar callbacks si es necesario
✅ Lazy load rutas
❌ No actualizar estado directamente

### CSS
✅ Usar utilities de Tailwind
✅ Composar clases en variables si es repetitivo
✅ Usar breakpoints consistentemente
❌ No mezclar CSS con clases de Tailwind

### API
✅ Siempre validar entrada
✅ Tipear responses
✅ Manejar errores explícitamente
❌ No confiar en datos del cliente

## 🚨 Errores Comunes

### Error: "Cannot read property 'X' of undefined"
- Verificar que el componente está dentro del Provider correcto
- Usar optional chaining `?.`

### Error: "Type 'any' is not assignable"
- Remover `as any`
- Crear interfaz apropiada

### Error: CORS blocked
- Verificar que CORS middleware está en Hono
- Comprobar origins permitidos

### Error: "Media not found"
- Verificar que token es válido
- Comprobar que media existe en DB

## 🌐 Deployment Checklist

- [ ] Variables de entorno configuradas
- [ ] Database schema aplicado
- [ ] R2 bucket creado
- [ ] CORS configurado
- [ ] JWT_SECRET establecido
- [ ] Build sin errores
- [ ] Tests pasando
- [ ] Lint sin warnings

## 📝 Commits Recomendados

```
feat: Agregar nueva feature
fix: Corregir bug
refactor: Reorganizar código
style: Cambios de formato
docs: Actualizar documentación
test: Agregar tests
chore: Dependencias y configuración
```

## 🎓 Próximos Pasos

1. **Agregar validación de formularios** (zod/yup)
2. **Implementar caché** (service workers)
3. **Agregar notificaciones** (toast)
4. **Mejorar SEO** (meta tags dinámicos)
5. **Agregar analytics** (Cloudflare Analytics)
6. **Implementar búsqueda** (full-text search)
7. **Agregar paginación** (para grandes colecciones)
8. **Mejorar seguridad** (rate limiting, CSRF)

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
**Autor**: Electrocicla Team
