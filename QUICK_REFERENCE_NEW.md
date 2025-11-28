# 🚀 QUICK REFERENCE - PYME Expositor

## Comandos Rápidos

```bash
# Desarrollo
pnpm dev                    # Iniciar servidor de desarrollo
pnpm build                  # Build para producción
pnpm preview                # Preview del build
pnpm deploy                 # Deploy a Cloudflare

# Worker
cd worker
npx wrangler dev            # Dev del worker
npx wrangler deploy         # Deploy worker

# Database
npx wrangler d1 create expositor_db
npx wrangler d1 execute expositor_db --file=schema.sql
npx wrangler d1 execute expositor_db --command="SELECT * FROM media"
```

## Rutas de la App

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page pública |
| `/login` | Login (password: `secretpassword`) |
| `/dashboard` | Dashboard de administración |
| `/demo` | Demo de componentes (agregar en App.tsx) |

## Componentes React Bits

### GlassCard
```tsx
<GlassCard blur="xl" opacity={10} border glow>
  Contenido
</GlassCard>
```

**Props:**
- `blur`: `sm` `md` `lg` `xl` `2xl` `3xl`
- `opacity`: `0-100`
- `border`: `boolean`
- `glow`: `boolean`

### ParallaxSection
```tsx
<ParallaxSection speed={0.5}>
  Contenido
</ParallaxSection>
```

**Props:**
- `speed`: `0.1-1.0` (menor = más lento)

### AnimatedGradient
```tsx
<AnimatedGradient
  from="from-indigo-500"
  via="via-purple-500"
  to="to-pink-500"
  speed="normal"
>
  Contenido
</AnimatedGradient>
```

**Props:**
- `from/via/to`: Clases Tailwind de color
- `speed`: `slow` `normal` `fast`

### FadeIn
```tsx
<FadeIn direction="up" delay={200} duration={700}>
  Contenido
</FadeIn>
```

**Props:**
- `direction`: `up` `down` `left` `right` `none`
- `delay`: milisegundos
- `duration`: milisegundos
- `threshold`: `0-1` (Intersection Observer)

## Animaciones CSS

```tsx
className="animate-shake"    // Sacudida (errores)
className="animate-float"    // Flotación suave
className="animate-glow"     // Brillo pulsante
className="animate-fade-in"  // Entrada suave
className="animate-blur-in"  // Blur a focus
className="animate-gradient" // Gradiente móvil
```

## Colores del Tema

```tsx
// ❌ Variables CSS no son compatibles con Tailwind v4 directamente
style={{ '--primary': '#6366f1' }}
className="bg-[var(--primary)]"

// ✅ Usar colores de Tailwind directamente
className="bg-indigo-500"

// Paleta recomendada
Primary: #6366f1 (indigo-500)
Secondary: #ec4899 (pink-500)
Accent: #8b5cf6 (purple-500)
```

## Estructura de Config

```tsx
const config: SiteConfig = {
  header: {
    title: "Mi Sitio",
    logoUrl: "https://...",
    layout: "left-logo", // "centered" | "compact"
    links: [
      { id: "1", label: "Home", url: "/" }
    ]
  },
  hero: {
    template: "simple", // "split" | "full-screen"
    title: "Título Principal",
    subtitle: "Subtítulo",
    ctaText: "Ver más",
    ctaUrl: "#",
    effect: "gradient" // "parallax" | "splash" | "glass" | "none"
  },
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#1e293b",
    fontFamily: "Inter",
    borderRadius: "0.5rem"
  }
}
```

## API Endpoints (Worker)

```
GET  /api/media              # Listar media
POST /api/media/upload       # Subir media
DEL  /api/media/:id          # Eliminar media

GET  /api/config/draft       # Config draft
GET  /api/config/published   # Config publicada
PUT  /api/config/draft       # Actualizar draft

POST /api/publish            # Publicar sitio
POST /api/auth/login         # Login
```

## Tailwind CSS v4 Cambios

```tsx
// Antes (v3)          // Ahora (v4)
bg-gradient-to-r      → bg-linear-to-r
bg-gradient-to-br     → bg-linear-to-br
flex-shrink-0         → shrink-0
bg-[length:200%]      → bg-size-[200%]
```

## Glassmorphism Pattern

```tsx
<div className="
  bg-white/10           {/* Fondo semitransparente */}
  backdrop-blur-xl      {/* Blur del fondo */}
  border border-white/20 {/* Borde sutil */}
  rounded-2xl           {/* Bordes redondeados */}
  shadow-2xl            {/* Sombra profunda */}
">
  Contenido
</div>
```

## Gradient Patterns

```tsx
// Hero background
<div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10" />

// Button
<button className="bg-linear-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500">

// Text gradient
<h1 className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-pink-600">
```

## Responsive Breakpoints

```tsx
sm:   640px  // Mobile landscape
md:   768px  // Tablet
lg:   1024px // Desktop
xl:   1280px // Large desktop
2xl:  1536px // Extra large
```

## Dark Mode

```tsx
className="
  bg-white dark:bg-slate-950
  text-slate-900 dark:text-white
  border-slate-200 dark:border-slate-800
"
```

## Performance Tips

1. **Lazy Load Images**
   ```tsx
   <img loading="lazy" src="..." />
   ```

2. **Intersection Observer**
   - FadeIn ya lo usa automáticamente

3. **Passive Listeners**
   - ParallaxSection usa `{ passive: true }`

4. **CSS Transforms**
   - Preferir `transform` sobre `top/left`
   ```tsx
   className="translate-x-4" // ✅
   className="left-4"        // ❌
   ```

## Common Patterns

### Card con Hover Effect
```tsx
<div className="group overflow-hidden rounded-2xl">
  <img className="transition-transform duration-700 group-hover:scale-110" />
  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
    Overlay content
  </div>
</div>
```

### Grid Responsivo
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

### Centering
```tsx
// Horizontal y vertical
<div className="flex items-center justify-center">

// Solo horizontal
<div className="mx-auto max-w-7xl">
```

## Debugging

```tsx
// Ver config actual
console.log(useConfig())

// Ver theme
console.log(useTheme())

// Ver errores de compilación
pnpm build

// Ver errores del worker
cd worker && npx wrangler tail
```

## Shortcuts VS Code

- `Ctrl+Shift+P` → Command Palette
- `Ctrl+P` → Quick Open
- `Ctrl+` → Terminal
- `F2` → Rename Symbol
- `Alt+Shift+F` → Format Document

## Recursos

- [Tailwind Docs](https://tailwindcss.com/docs)
- [React Bits](https://reactbits.dev)
- [Cloudflare Docs](https://developers.cloudflare.com)
- [Hono Framework](https://hono.dev)

## Archivos Importantes

```
IMPLEMENTATION_GUIDE.md  - Guía técnica detallada
MEJORAS_COMPLETADAS.md  - Resumen de mejoras
CHECKLIST.md            - Plan de implementación
README_NEW.md           - Documentación general
```

---

**Tip:** Guarda este archivo en favoritos para referencia rápida.
