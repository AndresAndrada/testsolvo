# Migración de Context API a Zustand para Gestión de Idiomas

## Por Qué

El sistema actual utiliza React Context API para gestionar el estado de idioma global. Zustand ofrece una solución más eficiente, con menor boilerplate, mejor rendimiento (sin re-renders innecesarios), y una API más simple que facilita el acceso al estado desde cualquier componente sin necesidad de providers.

## Qué Cambia

- **MODIFICADO**: Sistema de gestión de idiomas migrado de Context API a Zustand store
- **ELIMINADO**: `contexts/LanguageContext.tsx` - Reemplazado por Zustand store
- **NUEVO**: `stores/languageStore.ts` - Store de Zustand para gestión de idiomas
- **MODIFICADO**: `app/layout.tsx` - Eliminado LanguageProvider wrapper
- **MODIFICADO**: `components/ui/language-toggle.tsx` - Usa hook de Zustand en lugar de useLanguage
- **MODIFICADO**: Todos los componentes que usan `useLanguage()` ahora usan `useLanguageStore()`

## Impacto

### Capacidades Afectadas
- Gestión de estado global de idioma
- Persistencia de preferencia de idioma en localStorage
- Traducción de textos en toda la aplicación

### Código Afectado
- `contexts/LanguageContext.tsx` - Será eliminado
- `stores/languageStore.ts` - Nuevo archivo
- `app/layout.tsx` - Eliminación de provider
- `components/ui/language-toggle.tsx` - Cambio de hook
- `components/home/race-selector.tsx` - Cambio de hook
- `components/home/driver-selector.tsx` - Cambio de hook
- `components/home/strategy-builder.tsx` - Cambio de hook
- `components/home/results-view.tsx` - Cambio de hook
- `app/page.tsx` - Cambio de hook

## Requisitos NUEVOS

### Requisito: Store de Zustand para Idiomas
El sistema DEBE proporcionar un store de Zustand que gestione el estado de idioma de la aplicación.

#### Escenario: Cambio de idioma
- **CUANDO** el usuario cambia el idioma usando el switch toggle
- **ENTONCES** el estado se actualiza globalmente en todos los componentes
- **Y** la preferencia se guarda en localStorage con la key `f1-strategist-language`
- **Y** todos los textos de la UI se actualizan al nuevo idioma

#### Escenario: Carga inicial
- **CUANDO** la aplicación se monta por primera vez
- **ENTONCES** el sistema lee la preferencia de idioma desde localStorage
- **Y** si existe una preferencia guardada, la aplica
- **Y** si no existe, usa español como idioma por defecto

#### Escenario: Traducción de textos
- **CUANDO** un componente necesita mostrar texto traducido
- **ENTONCES** usa la función `t(key)` del store
- **Y** la función retorna el texto en el idioma actual
- **Y** soporta notación de punto para claves anidadas (ej: `raceSelector.title`)

## Requisitos MODIFICADOS

### Requisito: Hook de Idioma
**Antes**: `useLanguage()` hook que consume LanguageContext
**Ahora**: `useLanguageStore()` hook que consume Zustand store

**Cambios**:
- No requiere LanguageProvider en el árbol de componentes
- Acceso directo al estado sin Context
- Mejor rendimiento con subscripciones selectivas

## Requisitos ELIMINADOS

### Requisito: LanguageProvider Component
**Razón**: Zustand no requiere providers, el store es accesible globalmente
**Migración**: Simplemente remover el `<LanguageProvider>` del layout.tsx

### Requisito: LanguageContext
**Razón**: Reemplazado por Zustand store
**Migración**: Cambiar imports de `@/contexts/LanguageContext` a `@/stores/languageStore`

## Beneficios de la Migración

1. **Menos Boilerplate**: No requiere providers ni wrappers
2. **Mejor Rendimiento**: Subscripciones selectivas previenen re-renders innecesarios
3. **API más Simple**: Acceso directo al store sin necesidad de useContext
4. **DevTools**: Zustand tiene mejores herramientas de debugging
5. **TypeScript**: Mejor inferencia de tipos automática
6. **Bundle Size**: Zustand es más liviano que Context API + hooks

## Estructura del Store

```typescript
interface LanguageStore {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: string) => string;
}
```

## Compatibilidad

- React 19: ✅ Compatible
- Next.js 16: ✅ Compatible con App Router y Server Components
- Zustand 5.0.16: ✅ Versión instalada
