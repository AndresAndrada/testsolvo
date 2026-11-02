# Internationalization (i18n) System - F1 Race Strategist

## 📁 File Structure

```
testsolvo/
├── locales/
│   ├── es.json          # Spanish translations
│   └── en.json          # English translations
├── contexts/
│   └── LanguageContext.tsx  # Context API for language management
├── components/
│   └── ui/
│       ├── language-modal.tsx   # Modal for changing language
│       └── language-toggle.tsx  # Floating button for language switching
├── app/
│   ├── layout.tsx       # Updated with LanguageProvider
│   └── page.tsx         # Updated with LanguageToggle
```

## ✅ Implemented System

### 1. **Translation Files**
- ✅ `locales/es.json` - Spanish translations (default language)
- ✅ `locales/en.json` - English translations

**Included translation categories:**
- `common` - Common elements (loading, error, save, cancel, etc.)
- `language` - Language modal
- `navigation` - Navigation tabs
- `raceSelector` - Race selector
- `driverSelector` - Driver selector
- `strategyBuilder` - Strategy builder
- `resultsView` - Results view
- `savedStrategies` - Saved strategies
- `app` - Application titles and messages

**Features:**
- Type-safe with TypeScript (`Language = 'es' | 'en'`)
- Persistence in `localStorage` using the key `f1-strategist-language`
- Default language: **Spanish (es)**
- `t(key: string)` function for translation, with support for dot notation (e.g., `t('raceSelector.title')`)
- Custom `useLanguage()` hook for use within components

### 3. **UI Components**

#### **LanguageModal** (`components/ui/language-modal.tsx`)
✅ Elegant modal featuring:
- Backdrop blur and fade-in/scale-in animations
- Two language options with flags (🇪🇸 Spanish / 🇬🇧 English)
- Visual indicator for the selected language (blue checkmark)
- Close button (X) in the top-right corner
- Responsive design with dark mode support

#### **LanguageToggle** (`components/ui/language-toggle.tsx`)
✅ Floating button featuring:
- Fixed positioning in the top-right corner (`top-4 right-4`)
- Displays the current language's flag and code
- Hover effect with scaling
- Opens the modal upon clicking
- `z-index: 40` to ensure it sits above other elements

### 4. **Integration**

✅ **Updated Layout** (`app/layout.tsx`):
```tsx
<LanguageProvider>
  {children}
</LanguageProvider>
```

✅ **Main Page** (`app/page.tsx`):
```tsx
<LanguageToggle />
```

## 🚀 How to Use the i18n System in Components

### Basic Example

```tsx
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function MyComponent() {
  const { t, language } = useLanguage();
``` return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('raceSelector.selectRace')}</p>
      <button>{t('common.save')}</button>
      
      {/* Current language */}
      <p>Current language: {language}</p>
    </div>
  );
}
```
### Example with Nested Keys

```tsx
const { t } = useLanguage();

// Access using dot notation
t('strategyBuilder.tireCompounds.soft')     // "Blando" (es) / "Soft" (en)
t('strategyBuilder.validation.selectRace')  // "You must select a race" (es)
t('savedStrategies.table.name')             // "Nombre" (es) / "Name" (en)

### Example of Programmatic Language Change

```tsx
const { setLanguage } = useLanguage();

const handleChangeToEnglish = () => {
  setLanguage('en');
};

const handleChangeToSpanish = () => {
  setLanguage('es');
};
```

## 🎨 Visual Design

### Language Button (LanguageToggle)
```
┌─────────────────┐
│ 🇪🇸 ES    ▼    │  ← Floating button (fixed top-right)
└─────────────────┘
```

### Language Modal (LanguageModal)
```
┌──────────────────────────────────┐
│  Change Language             [X] │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │ 🇪🇸 Español            ✓  │  │ ← Selected
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ 🇬🇧 English               │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

## 📊 Translation Structure

### Español (es.json) - 139 lines
- 138 translation keys
- F1 terminology in Spanish

### English (en.json) - 139 lines
- 138 translation keys
- F1 terminology in English (international standard)

## ✨ Key Features

1. **Persistence**: The selected language is saved in `localStorage`
2. **Type-Safe**: TypeScript ensures correct typing
3. **SSR Compatible**: Hydration handling with Next.js 16
4. **Accessible**: ARIA labels and keyboard navigation
5. **Responsive**: Design that adapts to mobile and desktop
6. **Animations**: Smooth, modern transitions
7. **Dark Mode**: Full support for dark mode

## 🔧 System Testing

To verify functionality:

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Click the floating button (🇪🇸 ES) in the top-right corner

4. Select "English" from the modal

5. Confirm that the language changes and persists upon page reload

## 📝 Next Steps for Full Integration

To use the translations within existing components:

1. **RaceSelector** → Replace hardcoded text with `t('raceSelector.*')`
2. **DriverSelector** → Replace hardcoded text with `t('driverSelector.*')`
3. **StrategyBuilder** → Replace hardcoded text with `t('strategyBuilder.*')`
4. **ResultsView** → Replace hardcoded text with `t('resultsView.*')`
5. **NavigationTabs** → Replace hardcoded text with `t('navigation.*')`
6. **SavedStrategies** → Replace hardcoded text with `t('savedStrategies.*')`

## ✅ Verified Build

The project compiles successfully without errors:
```
✓ Compiled successfully in 16.8s
✓ Running TypeScript in 9.9s
✓ Generating static pages (12/12)
```

---

**System completed and ready for use** 🏎️🏁
