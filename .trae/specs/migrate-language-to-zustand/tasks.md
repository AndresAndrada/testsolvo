# Tareas - Migración a Zustand

- [x] Tarea 1: Crear Zustand store para gestión de idiomas
  - [x] Subtarea 1.1: Crear archivo `stores/languageStore.ts`
  - [x] Subtarea 1.2: Definir tipos TypeScript (Language, LanguageStore)
  - [x] Subtarea 1.3: Implementar store con `create` de Zustand
  - [x] Subtarea 1.4: Implementar persistencia en localStorage con middleware
  - [x] Subtarea 1.5: Implementar función `t(key)` para traducciones con soporte para notación de punto
  - [x] Subtarea 1.6: Importar traducciones desde `locales/es.json` y `locales/en.json`

- [x] Tarea 2: Actualizar layout para eliminar LanguageProvider
  - [x] Subtarea 2.1: Abrir `app/layout.tsx`
  - [x] Subtarea 2.2: Eliminar import de LanguageProvider
  - [x] Subtarea 2.3: Eliminar wrapper `<LanguageProvider>` del árbol de componentes

- [x] Tarea 3: Actualizar componente language-toggle
  - [x] Subtarea 3.1: Abrir `components/ui/language-toggle.tsx`
  - [x] Subtarea 3.2: Cambiar import de `useLanguage` a `useLanguageStore`
  - [x] Subtarea 3.3: Actualizar destructuring para usar el nuevo hook

- [x] Tarea 4: Actualizar page.tsx
  - [x] Subtarea 4.1: Abrir `app/page.tsx`
  - [x] Subtarea 4.2: Buscar usos de `useLanguage()`
  - [x] Subtarea 4.3: Reemplazar con `useLanguageStore()`
  - [x] Subtarea 4.4: Actualizar imports

- [x] Tarea 5: Actualizar componentes home
  - [x] Subtarea 5.1: Actualizar `components/home/race-selector.tsx`
  - [x] Subtarea 5.2: Actualizar `components/home/driver-selector.tsx`
  - [x] Subtarea 5.3: Actualizar `components/home/strategy-builder.tsx`
  - [x] Subtarea 5.4: Actualizar `components/home/results-view.tsx`
  - [x] Subtarea 5.5: Para cada componente: cambiar import y hook usage

- [x] Tarea 6: Eliminar Context API antiguo
  - [x] Subtarea 6.1: Verificar que ningún archivo use `LanguageContext`
  - [x] Subtarea 6.2: Eliminar archivo `contexts/LanguageContext.tsx`
  - [x] Subtarea 6.3: Eliminar carpeta `contexts/` si está vacía

- [x] Tarea 7: Verificar build y funcionamiento
  - [x] Subtarea 7.1: Ejecutar `npm run build` para verificar que no hay errores de TypeScript
  - [x] Subtarea 7.2: Iniciar servidor de desarrollo con `npm run dev`
  - [x] Subtarea 7.3: Probar cambio de idioma en la UI
  - [x] Subtarea 7.4: Verificar persistencia (recargar página y verificar idioma guardado)

# Dependencias de Tareas

- Tarea 2 depende de Tarea 1 (necesita que el store esté creado)
- Tarea 3 depende de Tarea 1 (necesita que el store esté creado)
- Tarea 4 depende de Tarea 1 (necesita que el store esté creado)
- Tarea 5 depende de Tarea 1 (necesita que el store esté creado)
- Tarea 6 depende de Tareas 2, 3, 4, 5 (solo eliminar cuando todo esté migrado)
- Tarea 7 depende de Tareas 1-6 (verificación final)
