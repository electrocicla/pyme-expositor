# Contribuciones a Expositor

Gracias por tu interés en contribuir a Expositor. Este documento proporciona directrices y procesos para contribuir.

## 📋 Antes de Empezar

- Lee el [README.md](./README.md)
- Revisa [DEVELOPMENT.md](./DEVELOPMENT.md)
- Familiarízate con [SETUP.md](./SETUP.md)

## 🚀 Proceso de Contribución

### 1. Fork el Proyecto

```bash
# En GitHub, click "Fork"
git clone https://github.com/tu-usuario/pyme-expositor.git
cd pyme-expositor
git remote add upstream https://github.com/electrocicla/pyme-expositor.git
```

### 2. Crear una Rama

```bash
# Actualizar main
git fetch upstream
git checkout main
git reset --hard upstream/main

# Crear rama de feature
git checkout -b feature/tu-feature-aqui
```

**Nombres de ramas recomendados**:
- `feature/descripcion` - Nueva funcionalidad
- `fix/descripcion` - Corrección de bug
- `docs/descripcion` - Documentación
- `refactor/descripcion` - Refactorización

### 3. Hacer Cambios

```bash
# Instalar dependencias
pnpm install

# Hacer cambios
# Verificar código
pnpm lint
pnpm run build

# Commit
git add .
git commit -m "feat: Descripción clara del cambio"
```

### 4. Push y Pull Request

```bash
git push origin feature/tu-feature-aqui
```

En GitHub, crear Pull Request con descripción clara.

## 📝 Estándares de Código

### TypeScript

```typescript
// ✅ Bien
interface UserProps {
  id: number
  name: string
  email: string
}

const User = ({ id, name, email }: UserProps) => {
  return <div>{name}</div>
}

// ❌ Mal
const User = (props: any) => {
  return <div>{props.name}</div>
}
```

### React

```typescript
// ✅ Bien
const MyComponent = () => {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  return <button onClick={handleClick}>{count}</button>
}

// ❌ Mal
const MyComponent = () => {
  let count = 0
  return <button onClick={() => count++}>{count}</button>
}
```

### Tailwind CSS

```typescript
// ✅ Bien
<div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg">
  Content
</div>

// ❌ Mal
<div className="flex items-center justify-between" style={{gap: '1rem'}}>
  Content
</div>
```

### API/Worker

```typescript
// ✅ Bien
app.get('/api/media/:id', async (c) => {
  try {
    const id = c.req.param('id')
    // Logic
    return c.json(result, 200)
  } catch (error) {
    return c.json({ error: 'Message' }, 500)
  }
})

// ❌ Mal
app.get('/api/media/:id', async (c) => {
  const data: any = await db.query(...)
  return c.text(JSON.stringify(data))
})
```

## 🎯 Commits

### Formato de Mensaje

```
<tipo>(<scope>): <asunto>

<cuerpo>

<pie>
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar tests
- `chore`: Dependencias, config, etc.

### Ejemplos

```
feat(dashboard): agregar filtro por tipo de media

Permite a los usuarios filtrar la galería por imagen o video.

Fixes #123
```

```
fix(auth): corregir expiración de token

El token ahora se valida correctamente antes de expirar.
```

## 🧪 Testing

Antes de hacer PR:

```bash
# Lint
pnpm lint

# Type check
pnpm run build

# Tests
cd worker && pnpm test
```

## 📋 Checklist para PR

- [ ] Código sigue estándares
- [ ] TypeScript strict mode sin errores
- [ ] Tests pasando
- [ ] Lint sin warnings
- [ ] Documentación actualizada
- [ ] Cambios responsivos (móvil, tablet, desktop)
- [ ] Dark mode compatible
- [ ] Accesibilidad considerada (ARIA labels, etc.)
- [ ] Performance revisado

## 🔍 Revisión de Código

Los PRs serán revisados por:
- Funcionalidad correcta
- Calidad de código
- Performance
- Seguridad
- Documentación

Se pueden solicitar cambios antes de mergear.

## 🐛 Reportar Bugs

### Crear Issue

<!-- Short English summary added by maintainer -->
# Contributing (Short)

Thank you for your interest in contributing to Expositor! Quick steps:

- Open an issue describing the bug or feature.
- Create a branch named `feature/<name>` or `fix/<name>`.
- Run `pnpm install`, `pnpm run typecheck`, and `pnpm lint` before opening a PR.
- Keep commits small and descriptive; open a PR against `main` with testing steps.

If you prefer Spanish guidance, a more detailed contribution guide follows.

---

````markdown
# Contribuciones a Expositor

Gracias por tu interés en contribuir a Expositor. Este documento proporciona directrices y procesos para contribuir.
## Pasos para Reproducir
1. ...
2. ...
3. ...

## Comportamiento Esperado
Qué debería pasar

## Comportamiento Actual
Qué está pasando

## Entorno
- OS: Windows/Mac/Linux
- Node: 18.x
- pnpm: 8.x
```

## 💡 Proponer Mejoras

```markdown
## Descripción
Descripción de la mejora

## Motivación
Por qué sería útil

## Casos de Uso
Ejemplos de uso

## Alternativas Consideradas
Otras opciones
```

## 🎓 Guía para Principiantes

### Mi primer PR

1. Fork el proyecto
2. Busca issues etiquetadas con `good-first-issue`
3. Comenta que quieres trabajar en ello
4. Sigue el proceso de contribución
5. ¡Submit tu PR!

### Recursos

- [Git Guide](https://rogerdudler.github.io/git-guide/es/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [React Best Practices](https://react.dev/learn)

## 🏆 Reconocimiento

Los contribuidores son reconocidos en:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- GitHub stats
- Changelog de release

## 📞 Preguntas

- Crear issue con etiqueta `question`
- Discutir en discussions

## 📜 Licencia

Al contribuir aceptas que tu código será licenciado bajo MIT.

---

**Gracias por contribuir a Expositor! 🎉**
