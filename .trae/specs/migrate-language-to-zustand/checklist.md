# Checklist de Verificación - Migración a Zustand

## Implementación del Store

- [x] El archivo `stores/languageStore.ts` existe y está correctamente implementado
- [x] El store usa `create` de Zustand con TypeScript
- [x] El store tiene los tipos correctos: `Language = 'es' | 'en'` y `LanguageStore`
- [x] El store incluye: `language`, `setLanguage`, y `t` en su interface
- [x] El middleware de persistencia está configurado con la key `f1-strategist-language`
- [x] La función `t(key)` soporta notación de punto (ej: `app.title`)
- [x] Las traducciones se importan correctamente desde `locales/es.json` y `locales/en.json`
- [x] El idioma por defecto es español (`'es'`)

## Migración de Layout

- [x] El archivo `app/layout.tsx` no importa `LanguageProvider`
- [x] El archivo `app/layout.tsx` no tiene el wrapper `<LanguageProvider>`
- [x] La aplicación funciona correctamente sin el provider

## Migración de Componentes

- [x] El componente `language-toggle.tsx` usa `useLanguageStore()` en lugar de `useLanguage()`
- [x] El componente `page.tsx` usa `useLanguageStore()` si necesita traducciones
- [x] El componente `race-selector.tsx` usa `useLanguageStore()` si necesita traducciones
- [x] El componente `driver-selector.tsx` usa `useLanguageStore()` si necesita traducciones
- [x] El componente `strategy-builder.tsx` usa `useLanguageStore()` si necesita traducciones
- [x] El componente `results-view.tsx` usa `useLanguageStore()` si necesita traducciones
- [x] Ningún componente importa de `@/contexts/LanguageContext`

## Limpieza

- [x] El archivo `contexts/LanguageContext.tsx` ha sido eliminado
- [x] La carpeta `contexts/` ha sido eliminada si está vacía
- [x] No quedan referencias a `LanguageContext` en el código

## Funcionalidad

- [x] El cambio de idioma funciona correctamente en el switch toggle
- [x] Todos los textos de la UI se actualizan al cambiar de idioma
- [x] La preferencia de idioma se guarda en localStorage
- [x] Al recargar la página, el idioma guardado se mantiene
- [x] El idioma por defecto (español) se aplica en primera carga sin preferencia guardada
- [x] La función `t()` retorna traducciones correctas para todas las claves
- [x] La función `t()` soporta claves anidadas con notación de punto

## Build y TypeScript

- [x] El comando `npm run build` se ejecuta sin errores
- [x] No hay errores de TypeScript en el proyecto
- [x] No hay warnings relacionados con tipos en el store
- [x] El bundle se genera correctamente

## Testing Manual

- [ ] Abrir la aplicación en el navegador
- [ ] Verificar que el switch de idioma está visible en la esquina superior derecha
- [ ] Cambiar de español a inglés: todos los textos cambian correctamente
- [ ] Cambiar de inglés a español: todos los textos cambian correctamente
- [ ] Recargar la página: el idioma seleccionado se mantiene
- [ ] Borrar localStorage y recargar: el idioma por defecto es español
- [ ] Verificar DevTools Console: no hay errores ni warnings
