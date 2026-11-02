# Specification: Input Components Modularization

## 1. Context and Objective

### Context
Currently, the F1 Race Strategy Simulator application has form inputs (select, input number, input text, buttons) scattered across multiple components (`race-selector.tsx`, `driver-selector.tsx`, `strategy-builder.tsx`). These inputs share similar styling patterns (dark theme, red accent on focus, border-white/10, bg-black/65) but the code is duplicated, making maintenance and consistency difficult.

### Objective
Modularize all input components into reusable, presentational-only UI primitives that:
- Consolidate styling in a single location
- Maintain the existing visual identity of the F1 application
- Are pure presentation components without internal state or validation logic
- Can be reused across all existing components
- Follow SOLID principles and component composition patterns

This specification covers the creation of modular input components (`Input`, `Select`, `Button`) in `/components/ui/inputs/` and the complete refactoring of all existing components to use these new primitives.

---

## 2. Components Modified

### New Components (to be created)
- `/components/ui/inputs/Input.tsx` — Text and number input primitive
- `/components/ui/inputs/Select.tsx` — Dropdown/select primitive
- `/components/ui/inputs/Button.tsx` — Button primitive

### Existing Components (to be refactored)
- `/components/home/race-selector.tsx` — Replace inline select with modular Select
- `/components/home/driver-selector.tsx` — Replace inline select with modular Select
- `/components/home/strategy-builder.tsx` — Replace inline inputs, selects, and buttons with modular primitives

---

## 3. Functional Requirements

### FR-1: Create Input Component
**WHILE** the system is rendering a form field that requires text or numeric input,  
**WHEN** the Input component is instantiated with props (type, value, onChange, disabled, min, max, placeholder, className),  
**THEN** the system shall render an HTML `<input>` element with:
- Base styling: `rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none`
- Dynamic attributes based on props (type, value, min, max, disabled)
- Custom className merged with base styling (if provided)
- onChange handler that invokes the parent callback with the input event

**Acceptance Criteria:**
- WHEN type="number", THEN the input accepts only numeric values
- WHEN type="text", THEN the input accepts any text value
- WHEN disabled=true, THEN the input shall apply `disabled:opacity-50 disabled:cursor-not-allowed` and prevent user interaction
- WHEN className prop is provided, THEN it shall be merged with the base classes without overriding essential styles
- WHERE the component is rendered, IT shall forward all standard HTML input attributes via `React.InputHTMLAttributes<HTMLInputElement>`

---

### FR-2: Create Select Component
**WHILE** the system is rendering a form field that requires selection from a list,  
**WHEN** the Select component is instantiated with props (value, onChange, disabled, children, className),  
**THEN** the system shall render an HTML `<select>` element with:
- Base styling: `w-full rounded-sm border border-white/10 bg-black/65 px-3 py-2 text-sm text-zinc-100 shadow-[0_20px_60px_-40px_rgba(239,68,68,0.8)] transition focus:border-red-500/60 focus:outline-none focus:ring-0`
- Dynamic disabled state
- Custom className merged with base styling (if provided)
- onChange handler that invokes the parent callback with the event
- Children elements rendered as `<option>` nodes

**Acceptance Criteria:**
- WHEN disabled=true, THEN the select shall prevent user interaction
- WHEN children prop contains option elements, THEN they shall be rendered inside the select dropdown
- WHERE the component is rendered, IT shall forward all standard HTML select attributes via `React.SelectHTMLAttributes<HTMLSelectElement>`
- WHEN className prop is provided, THEN it shall be merged with base classes

---

### FR-3: Create Button Component
**WHILE** the system is rendering an actionable UI element,  
**WHEN** the Button component is instantiated with props (type, onClick, disabled, children, variant, className),  
**THEN** the system shall render an HTML `<button>` element with:
- Base styling depending on variant prop:
  - `"primary"`: `rounded-sm border border-red-500/60 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`
  - `"secondary"`: `rounded-sm border border-white/10 px-2 py-1 text-xs text-zinc-300 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`
  - `"warning"`: `rounded-sm border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300 transition hover:bg-yellow-400/20 cursor-pointer`
  - `"ghost"`: `rounded-sm px-2 py-1 text-xs text-zinc-500 transition hover:text-red-400 cursor-pointer disabled:cursor-not-allowed`
- Dynamic type attribute (button, submit, reset)
- onClick handler forwarded to the button element
- Disabled state preventing interaction
- Children content rendered inside the button

**Acceptance Criteria:**
- WHEN variant="primary", THEN the button shall use the red accent theme
- WHEN variant="secondary", THEN the button shall use the neutral white/zinc theme
- WHEN variant="warning", THEN the button shall use the yellow warning theme
- WHEN variant="ghost", THEN the button shall have minimal styling with hover effect
- WHEN disabled=true, THEN the button shall be non-interactive and visually dimmed
- WHERE the component is rendered, IT shall forward all standard HTML button attributes via `React.ButtonHTMLAttributes<HTMLButtonElement>`
- WHEN className prop is provided, THEN it shall be merged with variant-specific base classes

---

### FR-4: Refactor race-selector.tsx
**WHILE** the race-selector component is being rendered,  
**WHEN** the component needs to display a race selection dropdown,  
**THEN** the system shall replace the inline `<select>` element with the modular `Select` component imported from `/components/ui/inputs/Select`

**Acceptance Criteria:**
- WHERE the original select element exists (line 68-80), IT shall be replaced with `<Select>` component
- WHEN the Select component is rendered, THEN it shall maintain identical visual appearance and behavior
- WHEN refactoring is complete, THEN no inline select styling shall remain in race-selector.tsx
- WHERE the component imports exist, IT shall include `import { Select } from '@/components/ui/inputs/Select'`

---

### FR-5: Refactor driver-selector.tsx
**WHILE** the driver-selector component is being rendered,  
**WHEN** the component needs to display a driver selection dropdown,  
**THEN** the system shall replace the inline `<select>` element with the modular `Select` component imported from `/components/ui/inputs/Select`

**Acceptance Criteria:**
- WHERE the original select element exists (line 86-97), IT shall be replaced with `<Select>` component
- WHEN the Select component is rendered, THEN it shall maintain identical visual appearance and behavior
- WHEN refactoring is complete, THEN no inline select styling shall remain in driver-selector.tsx
- WHERE the component imports exist, IT shall include `import { Select } from '@/components/ui/inputs/Select'`

---

### FR-6: Refactor strategy-builder.tsx
**WHILE** the strategy-builder component is being rendered,  
**WHEN** the component needs input controls for stint management,  
**THEN** the system shall replace all inline inputs, selects, and buttons with modular components from `/components/ui/inputs/`

**Acceptance Criteria:**
- WHERE the compound select exists (line 199-209), IT shall be replaced with `<Select>` component
- WHERE the fromLap input exists (line 213-222), IT shall be replaced with `<Input type="number">` component
- WHERE the toLap input exists (line 227-233), IT shall be replaced with `<Input type="number">` component
- WHERE the "Cover Race" button exists (line 167-174), IT shall be replaced with `<Button variant="secondary">`
- WHERE the "Add Stint" button exists (line 175-182), IT shall be replaced with `<Button variant="primary">`
- WHERE the "Remove Stint" button exists (line 235-241), IT shall be replaced with `<Button variant="ghost">`
- WHERE the "Auto-Fix" button exists (line 258-263), IT shall be replaced with `<Button variant="warning">`
- WHEN refactoring is complete, THEN no inline input/select/button styling shall remain in strategy-builder.tsx
- WHERE the component imports exist, IT shall include all three modular components: `import { Input, Select, Button } from '@/components/ui/inputs'`

---

### FR-7: Unit Testing
**WHILE** the system is being developed or verified,  
**WHEN** the test suite is executed,  
**THEN** the modular input components (`Input`, `Select`, `Button`) shall have unit tests verifying their rendering, prop passing, and variant styling.

**Acceptance Criteria:**
- WHEN testing `Input`, THEN it verifies text/number input handling and disabled states.
- WHEN testing `Select`, THEN it verifies rendering of options and selection changes.
- WHEN testing `Button`, THEN it verifies click events, disabled states, and variant classes.

---

## 4. Non-Functional Requirements

### NFR-1: Performance
- The modular input components shall introduce zero runtime performance overhead compared to inline implementations
- Component re-renders shall only occur when props change (React.memo if necessary)

### NFR-2: Maintainability
- All styling modifications shall require changes in only one location (`/components/ui/inputs/`)
- Components shall be independently testable without requiring parent context

### NFR-3: Accessibility
- All input components shall maintain semantic HTML structure (`<input>`, `<select>`, `<button>`)
- Focus states shall be clearly visible with the red accent border
- Disabled states shall be visually distinct and prevent interaction

### NFR-4: Consistency
- All modular components shall use the exact same styling tokens as the original inline implementations
- Visual regression shall be zero — users should not perceive any visual changes post-refactor

### NFR-5: Internationalization
- Input components shall not handle i18n directly — labels and placeholders are passed as props by parent components
- The components shall remain agnostic to the language store

### NFR-6: TypeScript Safety
- All components shall have strict TypeScript interfaces with no `any` types
- Props shall extend standard HTML element attributes to maintain full compatibility

---

## 5. Edge Cases and Constraints

### EC-1: Missing or Invalid Props
**WHEN** a component receives undefined or null for value prop,  
**THEN** it shall render without crashing and display an empty/default state

### EC-2: ClassName Conflicts
**WHEN** a parent passes a className that conflicts with base styling (e.g., `bg-white`),  
**THEN** the custom className shall be applied last, allowing overrides while maintaining structure classes (rounded, border, padding)

### EC-3: Disabled Inputs with Event Handlers
**WHEN** an input is disabled=true but still has an onChange handler,  
**THEN** the handler shall not be invoked on user interaction

### EC-4: Number Input Validation
**WHEN** Input type="number" receives non-numeric characters via paste or invalid input,  
**THEN** the HTML5 native behavior shall handle validation (no custom validation logic in the component)

### EC-5: Select Without Options
**WHEN** Select component renders with no children or empty children,  
**THEN** it shall render an empty dropdown without errors

### EC-6: Button Type Default
**WHEN** Button component is rendered without an explicit type prop,  
**THEN** it shall default to type="button" to prevent unintended form submission

### EC-7: Backward Compatibility During Migration
**WHILE** refactoring is in progress,  
**IF** a component is partially migrated,  
**THEN** both inline and modular inputs may temporarily coexist until full migration is complete

---

## 6. Out of Scope

The following items are explicitly excluded from this specification:

- Form validation logic (remains in parent components or hooks)
- State management for input values (parent components manage state)
- Error message display components (future spec)
- Label components (labels remain inline or in future spec)
- Input variants beyond the defined styles (size, color theming)
- Custom input types beyond text and number (date, checkbox, radio, file)
- Animation or transition effects beyond existing hover states
- Storybook or component documentation (documentation tooling is separate)

---

## 7. Definition of Done

This specification is considered complete when:

1. All three input components (Input, Select, Button) exist in `/components/ui/inputs/`
2. Each component exports proper TypeScript interfaces
3. All three existing components (race-selector, driver-selector, strategy-builder) are refactored to use modular inputs
4. No inline input/select/button styling remains in home components
5. The application runs without TypeScript or runtime errors
6. Visual regression is zero — the UI looks identical to pre-refactor state
7. All components follow the constitution principles (simplicity, functionality, stability, SOLID)

---

## 8. References

- Constitution: `/docs/constitution.md`
- Existing Components: `/components/home/race-selector.tsx`, `/components/home/driver-selector.tsx`, `/components/home/strategy-builder.tsx`
- UI Components Directory: `/components/ui/`
- Tech Stack: React 19, Next.js 16, Tailwind CSS v4, TypeScript
