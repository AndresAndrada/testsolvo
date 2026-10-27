---
name: production-readiness-checklist
description: Checklist automatizado para verificar si una aplicación Next.js está lista para producción, SEO optimizado y libre de errores críticos.
---

# Checklist de Preparación para Producción

Ejecuta este protocolo antes de dar por finalizada cualquier funcionalidad:

1. **Auditoría de Metadatos (SEO):**
   - [ ] Cada página principal exporta un objeto `metadata` estático o dinámico con `title`, `description` y `openGraph`.
   - [ ] Las imágenes principales tienen atributos `alt` descriptivos.

2. **Rendimiento y Carga:**
   - [ ] Las consultas a la API externa manejan tiempos de espera (*timeouts*) y reintentos.
   - [ ] Los componentes pesados de interfaz cuentan con estados de carga (`loading.tsx`).

3. **Verificación de Compilación:**
   - [ ] El comando `npm run build` se ejecuta con éxito absoluto y sin errores de TypeScript.
   - [ ] No existen console.logs de depuración residuales en los componentes de producción.---
name: production-readiness-checklist
description: Checklist automatizado para verificar si una aplicación Next.js está lista para producción, SEO optimizado y libre de errores críticos.
---

# Checklist de Preparación para Producción

Ejecuta este protocolo antes de dar por finalizada cualquier funcionalidad:

1. **Auditoría de Metadatos (SEO):**
   - [ ] Cada página principal exporta un objeto `metadata` estático o dinámico con `title`, `description` y `openGraph`.
   - [ ] Las imágenes principales tienen atributos `alt` descriptivos.

2. **Rendimiento y Carga:**
   - [ ] Las consultas a la API externa manejan tiempos de espera (*timeouts*) y reintentos.
   - [ ] Los componentes pesados de interfaz cuentan con estados de carga (`loading.tsx`).

3. **Verificación de Compilación:**
   - [ ] El comando `npm run build` se ejecuta con éxito absoluto y sin errores de TypeScript.
   - [ ] No existen console.logs de depuración residuales en los componentes de producción.