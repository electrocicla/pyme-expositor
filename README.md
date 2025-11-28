# Expositor - Media Showcase Platform

Una aplicación moderna y responsive para exponer y gestionar colecciones de medios (imágenes y videos). Construida con React, TypeScript, Tailwind CSS y desplegada en Cloudflare Workers.

## 🚀 Características

- **Responsive Design**: Adaptable automáticamente a desktop, tablet y mobile
- **Dark Mode**: Tema oscuro/claro con preferencias del sistema
- **Media Management**: Upload, editar y eliminar imágenes y videos
- **Authentication**: Sistema de login seguro con tokens JWT
- **Storage**: Integración con Cloudflare R2 para almacenamiento
- **Database**: D1 Database para persistencia de datos
- **TypeScript**: Type safety completo, sin tipos `any`
- **Rendimiento**: Optimizado para Cloudflare Workers

## 📋 Requisitos Previos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de Cloudflare
- Wrangler CLI instalado

## 🛠️ Instalación

### 1. Instalación del Frontend

```bash
cd pyme-expositor
pnpm install
```

### 2. Instalación del Worker

```bash
cd worker
pnpm install
```

## 🚀 Desarrollo Local

### Terminal 1 - Frontend (Vite Dev Server)

```bash
cd pyme-expositor
pnpm dev
```

El frontend estará disponible en `http://localhost:5173`

### Terminal 2 - Cloudflare Worker

```bash
cd worker
pnpm dev
```

El worker estará disponible en `http://localhost:8787`

El frontend proxy automáticamente las llamadas `/api/*` al worker.

## 🏗️ Estructura del Proyecto

```
pyme-expositor/
├── src/
│   ├── components/
│   │   ├── Landing.tsx        # Página principal con galería
│   │   ├── Login.tsx          # Formulario de login
│   │   ├── Dashboard.tsx      # Panel de administración
│   │   └── ThemeProvider.tsx  # Gestor de temas
│   ├── App.tsx                # Router principal
│   ├── main.tsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── worker/
│   ├── src/
│   │   └── index.ts           # API endpoints con Hono
│   ├── schema.sql             # Schema de base de datos
│   └── wrangler.jsonc         # Configuración de Wrangler
└── vite.config.ts             # Configuración de Vite
```

## 🔐 Autenticación

### Credenciales de Demo

- **Password**: `secretpassword`

En producción, cambiar en la variable de entorno `JWT_SECRET` en Wrangler.

## 📱 Responsive Design

La aplicación se adapta automáticamente a:

- **Mobile**: 320px - 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: 1024px - 1280px (lg)
- **Wide**: 1280px+ (xl, 2xl)

Todos los componentes usan Tailwind CSS breakpoints:
- `sm:` para tablets
- `md:` para pantallas medianas
- `lg:` para desktops
- `xl:` para extra large
- `2xl:` para full HD

## 🎨 Temas

- **Light Mode**: Tema claro por defecto
- **Dark Mode**: Tema oscuro automático según preferencias del sistema
- Las preferencias se guardan en `localStorage` bajo la clave `theme-preference`

## 📦 Deployment

### Frontend en Cloudflare Pages

```bash
cd pyme-expositor
pnpm build
# El resultado en `dist/` se sube automáticamente a Pages
```

### Worker en Cloudflare

```bash
cd worker
wrangler deploy
```

## 🗄️ Base de Datos (D1)

Iniciar schema:

```bash
cd worker
wrangler d1 execute expositor-db --file schema.sql
```

Tablas:
- `users`: Almacena credenciales
- `media`: Almacena metadatos de medios

## 📁 Storage (R2)

Los archivos se almacenan en R2 con estructura:
```
{timestamp}-{random}-{filename}
```

## 🔧 Configuración

### Variables de Entorno (worker/wrangler.jsonc)

```json
{
  "vars": {
    "JWT_SECRET": "tu-secreto-aqui",
    "ENVIRONMENT": "production"
  }
}
```

### Proxy Frontend (vite.config.ts)

```typescript
server: {
  proxy: {
    '/api': 'http://localhost:8787'
  }
}
```

## 📡 API Endpoints

### Públicos

- `GET /api/media` - Obtener lista de medios
- `POST /api/login` - Login del propietario

### Protegidos (requieren token Bearer)

- `GET /api/protected/media` - Obtener todos los medios con detalles
- `POST /api/protected/media` - Subir nuevo medio
- `PUT /api/protected/media/:id` - Editar medio
- `DELETE /api/protected/media/:id` - Eliminar medio

## 🎯 Mejoras Implementadas

✅ **Responsive Design**
- Componentes completamente adaptables
- Mobile-first approach
- Touch-friendly UI

✅ **Tipografía Mejorada**
- Escalado automático por breakpoint
- Jerarquía visual clara
- Legibilidad optimizada

✅ **Estilos Tailwind**
- Sin uso de `@apply`
- Utilities puras y composables
- Dark mode nativo

✅ **Performance**
- Lazy loading de imágenes
- Code splitting automático
- Minificación en producción

✅ **Type Safety**
- TypeScript strict mode
- Sin tipos `any`
- Interfaces definidas

✅ **Cloudflare Integration**
- D1 Database con queries tipadas
- R2 Storage con metadata
- CORS configurado
- Health checks incluidos

## 🚦 Testing

```bash
# Frontend
pnpm run lint

# Worker
cd worker && pnpm test
```

## 🐛 Troubleshooting

### El proxy de API no funciona
- Verificar que el worker está corriendo en `http://localhost:8787`
- Revisar que CORS está configurado correctamente

### Errores de base de datos
- Ejecutar schema.sql: `wrangler d1 execute expositor-db --file schema.sql`
- Verificar credenciales en wrangler.jsonc

### Problemas de storage
- Verificar que R2 bucket existe
- Comprobar permisos en Cloudflare

## 📚 Documentación Útil

- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Hono](https://hono.dev)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler)

## 📄 Licencia

MIT

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para issues o preguntas, crear un issue en el repositorio.

---

**Última actualización**: Enero 2024
**Compatible con**: Hydrogen 2025.5, React 19.1, React Router v7.6
