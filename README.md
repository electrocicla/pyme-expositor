# Expositor - Media Showcase Platform

Una aplicación moderna y responsive para exponer y gestionar colecciones de medios (imágenes y videos). Construida con React 19, TypeScript, Tailwind CSS, y desplegada en Cloudflare Workers con almacenamiento R2.

## 🚀 Características

- **Responsive Design**: Adaptable automáticamente a desktop, tablet y mobile
- **Dark Mode**: Tema oscuro/claro con preferencias del sistema
- **Media Management**: Upload, editar y eliminar imágenes y videos
- **Authentication**: Sistema de login seguro con tokens JWT
- **Storage**: Integración con Cloudflare R2 para almacenamiento
- **ReactBits Components**: Biblioteca completa de componentes animados y visuales
- **Editor Visual**: Interfaz de arrastrar y soltar para configuración
- **Testing Completo**: 299+ tests con Vitest y React Testing Library
- **CI/CD**: GitHub Actions con linting, typecheck, testing y deployment automático

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Cloudflare Workers (Hono), D1 Database, R2 Storage
- **Testing**: Vitest, React Testing Library, Playwright
- **Deployment**: Cloudflare Pages + Workers
- **CI/CD**: GitHub Actions

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- pnpm 8+
- Cuenta Cloudflare (Workers, R2, D1)

### Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/electrocicla/pyme-expositor.git
cd pyme-expositor

# Instalar dependencias
pnpm install
cd worker && pnpm install && cd ..

# Configurar variables de entorno
cp worker/.env.example worker/.env
# Editar worker/.env con tus valores seguros

# Iniciar desarrollo
pnpm dev          # Frontend (puerto 5173)
cd worker && pnpm dev  # Worker (puerto 8787)
```

### Variables de Entorno

Crear `worker/.env` basado en `worker/.env.example`:

```bash
JWT_SECRET=tu-secreto-super-seguro-aqui
ENVIRONMENT=development
```

## 🧪 Testing

```bash
# Tests completos
pnpm test

# Tests del worker
cd worker && pnpm test

# Coverage
pnpm test --coverage
```

## 🚀 Build & Deploy

```bash
# Build
pnpm build

# Deploy completo (Pages + Worker)
pnpm deploy

# Deploy individual
pnpm deploy:pages
pnpm deploy:worker
```

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/
│   │   ├── ReactBits/          # Biblioteca de componentes animados
│   │   ├── Editor/             # Editor visual
│   │   ├── Landing/            # Páginas públicas
│   │   └── ...
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API services
│   └── types/                  # TypeScript definitions
├── worker/                     # Cloudflare Worker backend
│   ├── src/
│   ├── test/
│   └── wrangler.jsonc
├── public/                     # Assets estáticos
└── dist/                       # Build output
```

## 🎨 ReactBits Components

Biblioteca completa de componentes visuales:

- AnimatedGradient, AuroraBackground, FloatingParticles
- GlassCard, ElectricBorder, ClickSpark
- TypewriterText, KenBurns, VideoHero
- MasonryGallery, Lightbox, WaveSeparator
- Y muchos más...

## 🔐 API Endpoints

- `GET /api/media` — Listar medios públicos
- `GET /api/config` — Obtener configuración publicada
- `POST /api/config` — Guardar borrador (requiere auth)
- `POST /api/config/publish` — Publicar configuración (requiere auth)
- `POST /api/media` — Upload de archivos (requiere auth)

## 📊 Estado del Proyecto

- ✅ ReactBits components (6 componentes, 110 tests)
- ✅ Sistema de autenticación JWT
- ✅ Gestión de medios con R2
- ✅ Editor visual completo
- ✅ Testing completo (299 tests)
- ✅ CI/CD pipeline
- ✅ Seguridad: Variables de entorno
- ✅ Build optimizado (chunks separados)

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)

---

**Última actualización**: Diciembre 2024
```bash
