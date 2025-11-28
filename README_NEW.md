# 🎨 PYME Expositor - SaaS Landing + Portfolio con Editor Visual

> **Boilerplate altamente personalizable para crear landing pages y portafolios profesionales con editor visual en tiempo real**

## ✨ Características Implementadas

### 🔐 Login Espectacular
- ✅ Fondo con gradientes animados (indigo, purple, pink)
- ✅ Glassmorphism avanzado con backdrop-blur
- ✅ Partículas flotantes animadas
- ✅ Efecto SplashCursor de React Bits
- ✅ Glow effect en card principal
- ✅ Transiciones profesionales
- ✅ Responsive y Dark Mode

### 🧩 Componentes React Bits
- ✅ **GlassCard** - Cards con efecto glass
- ✅ **ParallaxSection** - Parallax con scroll
- ✅ **AnimatedGradient** - Gradientes animados
- ✅ **FadeIn** - Animaciones de entrada
- ✅ **SplashCursor** - Efecto cursor
- ✅ **PixelCard** - Cards con pixeles

### 🎬 Animaciones CSS
- ✅ `shake` - Para errores
- ✅ `float` - Elementos flotantes
- ✅ `glow` - Efectos luminosos
- ✅ `fade-in` - Entrada suave
- ✅ `blur-in` - Blur a focus
- ✅ `gradient-xy` - Gradientes móviles

## 🚀 Quick Start

```bash
# Instalar dependencias
pnpm install

# Desarrollo local
pnpm dev

# Build para producción
pnpm build

# Deploy a Cloudflare Pages
pnpm deploy
```

Visita `http://localhost:5173` y navega a:
- `/` - Landing page
- `/login` - Login mejorado (usa password: `secretpassword`)
- `/dashboard` - Dashboard de administración

## 📁 Estructura del Proyecto

```
pyme-expositor/
├── src/
│   ├── components/
│   │   ├── ReactBits/          # Componentes de efectos
│   │   │   ├── GlassCard.tsx
│   │   │   ├── ParallaxSection.tsx
│   │   │   ├── AnimatedGradient.tsx
│   │   │   ├── FadeIn.tsx
│   │   │   ├── SplashCursor.tsx
│   │   │   └── PixelCard.tsx
│   │   ├── Editor/             # Editor visual (WIP)
│   │   │   └── VisualEditor.tsx
│   │   ├── Landing.tsx         # Landing page
│   │   ├── Login.tsx           # Login mejorado ✨
│   │   ├── Dashboard.tsx       # Admin dashboard
│   │   └── DemoPage.tsx        # Demo de componentes
│   ├── contexts/
│   │   └── ConfigContext.tsx   # Context de configuración
│   ├── services/
│   │   ├── auth.ts            # Servicio de autenticación
│   │   ├── media.ts           # Servicio de media
│   │   └── api.ts             # API client
│   ├── types/
│   │   └── config.ts          # Tipos TypeScript
│   └── utils/
│       └── api.ts             # Utilidades API
├── worker/
│   ├── src/
│   │   └── index.ts           # Cloudflare Worker
│   └── schema.sql             # Schema D1
├── IMPLEMENTATION_GUIDE.md    # Guía técnica completa
├── MEJORAS_COMPLETADAS.md     # Resumen de mejoras
└── package.json
```

## 🎨 Uso de Componentes React Bits

### GlassCard
```tsx
import GlassCard from './components/ReactBits/GlassCard'

<GlassCard 
  blur="xl"        // sm | md | lg | xl | 2xl | 3xl
  opacity={10}     // 0-100
  border={true}    // true | false
  glow={false}     // true | false
>
  <h2>Contenido</h2>
</GlassCard>
```

### ParallaxSection
```tsx
import ParallaxSection from './components/ReactBits/ParallaxSection'

<ParallaxSection speed={0.5}> {/* 0.1-1.0 */}
  <div>Este contenido tiene parallax</div>
</ParallaxSection>
```

### AnimatedGradient
```tsx
import AnimatedGradient from './components/ReactBits/AnimatedGradient'

<AnimatedGradient
  from="from-indigo-500"
  via="via-purple-500"
  to="to-pink-500"
  speed="normal"  // slow | normal | fast
  className="h-screen"
>
  <div>Contenido con fondo animado</div>
</AnimatedGradient>
```

### FadeIn
```tsx
import FadeIn from './components/ReactBits/FadeIn'

<FadeIn 
  direction="up"     // up | down | left | right | none
  delay={200}        // ms
  duration={700}     // ms
  threshold={0.1}    // 0-1
>
  <div>Este elemento hace fade in</div>
</FadeIn>
```

## 🎯 Configuración del Sitio

La configuración se define en `src/types/config.ts`:

```typescript
interface SiteConfig {
  header: {
    title: string
    logoUrl?: string
    layout: 'centered' | 'left-logo' | 'compact'
    links: Array<{ label: string; url: string; id: string }>
  }
  hero: {
    template: 'simple' | 'split' | 'full-screen'
    title: string
    subtitle: string
    ctaText: string
    ctaUrl: string
    effect: 'none' | 'parallax' | 'tilt' | 'glass' | 'gradient' | ...
  }
  gallery: {
    title: string
    showFilters: boolean
  }
  footer: {
    socials: { facebook?: string; twitter?: string; ... }
    contact: { email?: string; phone?: string; ... }
    showNewsletter: boolean
    showCopyright: boolean
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    borderRadius: string
  }
}
```

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, TailwindCSS 4
- **Build**: Vite (Rolldown)
- **Backend**: Cloudflare Workers (Hono)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **Deployment**: Cloudflare Pages
- **Package Manager**: pnpm

## 🔧 Cloudflare Setup

### 1. Crear D1 Database
```bash
cd worker
npx wrangler d1 create expositor_db
npx wrangler d1 execute expositor_db --file=schema.sql
```

### 2. Crear R2 Bucket
```bash
npx wrangler r2 bucket create expositor_storage
```

### 3. Configurar Variables de Entorno

En `worker/wrangler.jsonc`:
```jsonc
{
  "name": "pyme-expositor-worker",
  "main": "src/index.ts",
  "compatibility_date": "2024-01-01",
  "d1_databases": [
    {
      "binding": "expositor_db",
      "database_name": "expositor_db",
      "database_id": "YOUR_D1_DATABASE_ID"
    }
  ],
  "r2_buckets": [
    {
      "binding": "expositor_storage",
      "bucket_name": "expositor_storage"
    }
  ],
  "vars": {
    "JWT_SECRET": "your-secret-key-here",
    "R2_PUBLIC_URL": "https://your-r2-url.com",
    "ENVIRONMENT": "production"
  }
}
```

### 4. Deploy

```bash
# Deploy Worker
cd worker
npx wrangler deploy

# Deploy Pages
cd ..
pnpm build
npx wrangler pages deploy dist
```

## 📖 Documentación

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Guía técnica completa con ejemplos de código
- **[MEJORAS_COMPLETADAS.md](./MEJORAS_COMPLETADAS.md)** - Resumen detallado de todas las mejoras

## 🎨 Paleta de Colores

```css
/* Primary */
--indigo-500: #6366f1
--purple-500: #a855f7
--pink-500: #ec4899

/* Dark Mode */
--slate-950: #020617
--slate-900: #0f172a
--slate-800: #1e293b

/* Light Mode */
--white: #ffffff
--slate-50: #f8fafc
--slate-100: #f1f5f9
```

## 🔐 Credenciales Demo

**Password**: `secretpassword`

## 📝 Próximos Pasos

- [ ] Completar editor visual con live preview
- [ ] Añadir más efectos React Bits (Tilt, Lightbox, etc.)
- [ ] Implementar upload de media a R2
- [ ] Crear sistema de plantillas
- [ ] Añadir analytics
- [ ] SEO optimization
- [ ] Lighthouse >90

## 📜 Licencia

MIT

## 👨‍💻 Autor

Creado con 💜 usando React Bits

---

**¿Necesitas ayuda?** Consulta la [documentación completa](./IMPLEMENTATION_GUIDE.md) o abre un issue.
