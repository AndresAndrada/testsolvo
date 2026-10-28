# Sistema de Internacionalización (i18n) - F1 Race Strategist

## 📁 Estructura de Archivos Creados

```
testsolvo/
├── locales/
│   ├── es.json          # Traducciones en español
│   └── en.json          # Traducciones en inglés
├── contexts/
│   └── LanguageContext.tsx  # Context API para gestión de idioma
├── components/
│   └── ui/
│       ├── language-modal.tsx   # Modal para cambiar idioma
│       └── language-toggle.tsx  # Botón flotante de cambio de idioma
├── app/
│   ├── layout.tsx       # Actualizado con LanguageProvider
│   └── page.tsx         # Actualizado con LanguageToggle
```

## ✅ Sistema Implementado

### 1. **Archivos de Traducción**
- ✅ `locales/es.json` - Traducciones en español (idioma por defecto)
- ✅ `locales/en.json` - Traducciones en inglés

**Categorías de traducción incluidas:**
- `common` - Elementos comunes (loading, error, save, cancel, etc.)
- `language` - Modal de idioma
- `navigation` - Tabs de navegación
- `raceSelector` - Selector de carrera
- `driverSelector` - Selector de piloto
- `strategyBuilder` - Constructor de estrategia
- `resultsView` - Vista de resultados
- `savedStrategies` - Estrategias guardadas
- `app` - Títulos y mensajes de la aplicación

### 2. **Context de Idioma**
✅ `contexts/LanguageContext.tsx`

**Características:**
- Type-safe con TypeScript (`Language = 'es' | 'en'`)
- Persistencia en `localStorage` con clave `f1-strategist-language`
- Idioma por defecto: **Español (es)**
- Función `t(key: string)` para traducir con soporte de notación de punto (ej: `t('raceSelector.title')`)
- Hook personalizado `useLanguage()` para usar en componentes

### 3. **Componentes UI**

#### **LanguageModal** (`components/ui/language-modal.tsx`)
✅ Modal elegante con:
- Backdrop blur y animaciones fade-in/scale-in
- Dos opciones de idioma con banderas (🇪🇸 Español / 🇬🇧 English)
- Indicador visual del idioma seleccionado (checkmark azul)
- Botón de cerrar (X) en la esquina superior derecha
- Diseño responsive con modo oscuro

#### **LanguageToggle** (`components/ui/language-toggle.tsx`)
✅ Botón flotante con:
- Posición fija en la esquina superior derecha (`top-4 right-4`)
- Muestra bandera y código del idioma actual
- Hover effect con scale
- Abre el modal al hacer click
- z-index 40 para estar sobre otros elementos

### 4. **Integración**

✅ **Layout actualizado** (`app/layout.tsx`):
```tsx
<LanguageProvider>
  {children}
</LanguageProvider>
```

✅ **Página principal** (`app/page.tsx`):
```tsx
<LanguageToggle />
```

## 🚀 Cómo Usar el Sistema de i18n en Componentes

### Ejemplo Básico

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function MyComponent() {
  const { t, language } = useLanguage();

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('raceSelector.selectRace')}</p>
      <button>{t('common.save')}</button>
      
      {/* Idioma actual */}
      <p>Current language: {language}</p>
    </div>
  );
}
```

### Ejemplo con Claves Anidadas

```tsx
const { t } = useLanguage();

// Acceso con notación de punto
t('strategyBuilder.tireCompounds.soft')     // "Blando" (es) / "Soft" (en)
t('strategyBuilder.validation.selectRace')  // "Debes seleccionar una carrera" (es)
t('savedStrategies.table.name')             // "Nombre" (es) / "Name" (en)
```

### Ejemplo de Cambio Programático de Idioma

```tsx
const { setLanguage } = useLanguage();

const handleChangeToEnglish = () => {
  setLanguage('en');
};

const handleChangeToSpanish = () => {
  setLanguage('es');
};
```

## 🎨 Diseño Visual

### Botón de Idioma (LanguageToggle)
```
┌─────────────────┐
│ 🇪🇸 ES    ▼    │  ← Botón flotante (fixed top-right)
└─────────────────┘
```

### Modal de Idioma (LanguageModal)
```
┌──────────────────────────────────┐
│  Cambiar Idioma              [X] │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │ 🇪🇸 Español            ✓  │  │ ← Seleccionado
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ 🇬🇧 English               │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## 📊 Estructura de Traducciones

### Español (es.json) - 139 líneas
- 138 claves de traducción
- Terminología F1 en español

### Inglés (en.json) - 139 líneas
- 138 claves de traducción
- Terminología F1 en inglés (estándar internacional)

## ✨ Características Destacadas

1. **Persistencia**: El idioma seleccionado se guarda en localStorage
2. **Type-Safe**: TypeScript garantiza tipos correctos
3. **SSR Compatible**: Manejo de hydration con Next.js 16
4. **Accesible**: Labels ARIA y navegación por teclado
5. **Responsive**: Diseño adaptable a móviles y desktop
6. **Animaciones**: Transiciones suaves y modernas
7. **Dark Mode**: Soporte completo para modo oscuro

## 🔧 Testing del Sistema

Para verificar el funcionamiento:

1. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

2. Abrir http://localhost:3000

3. Hacer click en el botón flotante (🇪🇸 ES) en la esquina superior derecha

4. Seleccionar "English" en el modal

5. Verificar que el idioma cambia y persiste al recargar la página

## 📝 Próximos Pasos para Integración Completa

Para usar las traducciones en los componentes existentes:

1. **RaceSelector** → Reemplazar textos hardcodeados con `t('raceSelector.*')`
2. **DriverSelector** → Reemplazar textos hardcodeados con `t('driverSelector.*')`
3. **StrategyBuilder** → Reemplazar textos hardcodeados con `t('strategyBuilder.*')`
4. **ResultsView** → Reemplazar textos hardcodeados con `t('resultsView.*')`
5. **NavigationTabs** → Reemplazar textos hardcodeados con `t('navigation.*')`
6. **SavedStrategies** → Reemplazar textos hardcodeados con `t('savedStrategies.*')`

## ✅ Build Verificado

El proyecto compila exitosamente sin errores:
```
✓ Compiled successfully in 16.8s
✓ Running TypeScript in 9.9s
✓ Generating static pages (12/12)
```

---

**Sistema completado y listo para uso** 🏎️🏁
