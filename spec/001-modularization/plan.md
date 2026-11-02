# Implementation Plan: Input Components Modularization

## Overview
This plan outlines the step-by-step implementation strategy for modularizing input components in the F1 Race Strategy Simulator. The plan follows a sequential approach to minimize risk and ensure zero visual regression.

**Estimated Complexity:** Medium  
**Implementation Strategy:** Bottom-up (primitives first, then refactor consumers)  
**Risk Level:** Low (pure presentation refactor with no business logic changes)

---

## Pre-Implementation Checklist

- [ ] Read and understand `/docs/constitution.md`
- [ ] Read and understand `/spec/001-modularization/spec.md`
- [ ] Verify current application runs without errors (`npm run dev`)
- [ ] Take visual screenshots of all affected components for regression comparison
- [ ] Ensure Git working directory is clean (commit or stash pending changes)

---

## Phase 1: Setup and Infrastructure

### Task 1.1: Create Directory Structure
**Objective:** Establish the folder structure for modular input components

**Actions:**
1. Create directory: `/components/ui/inputs/`
2. Verify directory is created successfully
3. Prepare for component file creation

**Success Criteria:**
- Directory `/components/ui/inputs/` exists
- No errors during directory creation

**Estimated Time:** 1 minute

---

### Task 1.2: Create index.ts Barrel Export
**Objective:** Set up centralized export point for all input components

**Actions:**
1. Create file: `/components/ui/inputs/index.ts`
2. Prepare export structure (will be populated as components are created):
   ```typescript
   export { Input } from './Input';
   export { Select } from './Select';
   export { Button } from './Button';
   ```

**Success Criteria:**
- File `/components/ui/inputs/index.ts` exists
- Ready to export components (even if they don't exist yet)

**Estimated Time:** 2 minutes

---

## Phase 2: Create Primitive Components

### Task 2.0: Setup Testing Environment
**Objective:** Configure Jest and React Testing Library
**Actions:** Install dependencies and create `jest.config.js` and `jest.setup.js`.

### Task 2.1: Write Tests for Primitives
**Objective:** Implement TDD by writing failing tests for Input, Select, and Button.
**Actions:** Create `__tests__/Input.test.tsx`, `__tests__/Select.test.tsx`, and `__tests__/Button.test.tsx` ensuring they cover all Acceptance Criteria from FR-7.

### Task 2.2: Implement Input Component
**Objective:** Create the Input primitive component (FR-1)

**File:** `/components/ui/inputs/Input.tsx`

**Implementation Details:**
1. Create TypeScript interface `InputProps` extending `React.InputHTMLAttributes<HTMLInputElement>`
2. Add custom props: `className?: string`
3. Implement functional component with:
   - Base styling: `rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none`
   - Disabled styling: `disabled:opacity-50 disabled:cursor-not-allowed`
   - ClassName merging using template literals or `clsx` utility
4. Forward all HTML input attributes via spread operator `{...rest}`
5. Export component and interface

**Acceptance Criteria:**
- Component accepts `type="text"` and `type="number"`
- Component accepts standard input props: `value`, `onChange`, `disabled`, `min`, `max`, `placeholder`
- Custom `className` merges correctly without breaking base styles
- TypeScript compilation passes with no errors
- Component is "use client" directive (Next.js App Router requirement)

**Edge Cases to Handle:**
- EC-1: Undefined/null value prop
- EC-2: ClassName conflicts
- EC-3: Disabled input with onChange handler
- EC-4: Native HTML5 number validation

**Code Structure:**
```typescript
"use client";

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Additional custom props if needed
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    // Implementation
  }
);

Input.displayName = "Input";
```

**Estimated Time:** 15 minutes

---

### Task 2.2: Implement Select Component
**Objective:** Create the Select primitive component (FR-2)

**File:** `/components/ui/inputs/Select.tsx`

**Implementation Details:**
1. Create TypeScript interface `SelectProps` extending `React.SelectHTMLAttributes<HTMLSelectElement>`
2. Add custom props: `className?: string`
3. Implement functional component with:
   - Base styling: `w-full rounded-sm border border-white/10 bg-black/65 px-3 py-2 text-sm text-zinc-100 shadow-[0_20px_60px_-40px_rgba(239,68,68,0.8)] transition focus:border-red-500/60 focus:outline-none focus:ring-0`
   - ClassName merging
4. Render children (option elements) inside select
5. Forward all HTML select attributes via spread operator
6. Export component and interface

**Acceptance Criteria:**
- Component accepts `value`, `onChange`, `disabled`, `children`
- Children render correctly as options
- Custom `className` merges correctly
- TypeScript compilation passes
- Component is "use client" directive

**Edge Cases to Handle:**
- EC-1: Undefined/null value
- EC-2: ClassName conflicts
- EC-5: Select without options/children

**Code Structure:**
```typescript
"use client";

import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Additional custom props if needed
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...rest }, ref) => {
    // Implementation
  }
);

Select.displayName = "Select";
```

**Estimated Time:** 15 minutes

---

### Task 2.3: Implement Button Component
**Objective:** Create the Button primitive component with variants (FR-3)

**File:** `/components/ui/inputs/Button.tsx`

**Implementation Details:**
1. Create TypeScript interface `ButtonProps` extending `React.ButtonHTMLAttributes<HTMLButtonElement>`
2. Add custom props:
   - `variant?: "primary" | "secondary" | "warning" | "ghost"`
   - `className?: string`
3. Implement variant style mapping:
   - `primary`: `rounded-sm border border-red-500/60 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`
   - `secondary`: `rounded-sm border border-white/10 px-2 py-1 text-xs text-zinc-300 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`
   - `warning`: `rounded-sm border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300 transition hover:bg-yellow-400/20 cursor-pointer`
   - `ghost`: `rounded-sm px-2 py-1 text-xs text-zinc-500 transition hover:text-red-400 cursor-pointer disabled:cursor-not-allowed`
4. Default `type="button"` to prevent unintended form submission (EC-6)
5. Forward all HTML button attributes
6. Export component and interface

**Acceptance Criteria:**
- All four variants render with correct styles
- Default type is "button"
- Disabled state works correctly
- Custom className merges with variant styles
- TypeScript compilation passes
- Component is "use client" directive

**Edge Cases to Handle:**
- EC-2: ClassName conflicts
- EC-3: Disabled button with onClick handler
- EC-6: Default button type

**Code Structure:**
```typescript
"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "warning" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", type = "button", className, children, ...rest }, ref) => {
    // Implementation with variant mapping
  }
);

Button.displayName = "Button";
```

**Estimated Time:** 20 minutes

---

### Task 2.4: Verify Primitive Components
**Objective:** Ensure all primitive components are correctly exported and TypeScript compiles

**Actions:**
1. Verify `/components/ui/inputs/index.ts` exports all three components
2. Run TypeScript compilation: `npm run build` or `npx tsc --noEmit`
3. Fix any TypeScript errors
4. Verify no runtime errors in development server

**Success Criteria:**
- All components export successfully from barrel file
- TypeScript compilation passes with zero errors
- Development server runs without crashes
- Components are accessible via `import { Input, Select, Button } from '@/components/ui/inputs'`

**Estimated Time:** 5 minutes

---

## Phase 3: Refactor Existing Components

### Task 3.1: Refactor race-selector.tsx
**Objective:** Replace inline select with modular Select component (FR-4)

**File:** `/components/home/race-selector.tsx`

**Actions:**
1. Add import: `import { Select } from '@/components/ui/inputs/Select';`
2. Locate inline `<select>` element (lines 68-80)
3. Replace `<select>` with `<Select>` component
4. Remove inline styling from select element
5. Ensure all props are correctly passed: `id`, `value`, `onChange`
6. Keep `<option>` children unchanged

**Before (lines 68-80):**
```tsx
<select
  id="race"
  value={selectedRaceId || ""}
  onChange={(e) => onSelectRace(e.target.value)}
  className="mt-1 w-full rounded-sm border border-white/10 bg-black/65 px-3 py-2 text-sm text-zinc-100 shadow-[0_20px_60px_-40px_rgba(239,68,68,0.8)] transition focus:border-red-500/60 focus:outline-none focus:ring-0"
>
  {/* options */}
</select>
```

**After:**
```tsx
<Select
  id="race"
  value={selectedRaceId || ""}
  onChange={(e) => onSelectRace(e.target.value)}
>
  {/* options */}
</Select>
```

**Verification:**
1. Visual comparison: dropdown should look identical
2. Functionality test: selecting races should work as before
3. No TypeScript errors
4. No inline select styling remains

**Success Criteria:**
- Inline select replaced with modular Select
- Visual regression is zero
- Functionality is preserved
- Import statement added

**Estimated Time:** 10 minutes

---

### Task 3.2: Refactor driver-selector.tsx
**Objective:** Replace inline select with modular Select component (FR-5)

**File:** `/components/home/driver-selector.tsx`

**Actions:**
1. Add import: `import { Select } from '@/components/ui/inputs/Select';`
2. Locate inline `<select>` element (lines 86-97)
3. Replace `<select>` with `<Select>` component
4. Remove inline styling from select element
5. Ensure all props are correctly passed: `id`, `value`, `onChange`
6. Keep `<option>` children unchanged

**Before (lines 86-97):**
```tsx
<select
  id="driver"
  value={selectedDriverId || ""}
  onChange={(e) => onSelectDriver(e.target.value)}
  className="mt-1 w-full rounded-sm border border-white/10 bg-black/65 px-3 py-2 text-sm text-zinc-100 shadow-[0_20px_60px_-40px_rgba(239,68,68,0.8)] transition focus:border-red-500/60 focus:outline-none focus:ring-0"
>
  {/* options */}
</select>
```

**After:**
```tsx
<Select
  id="driver"
  value={selectedDriverId || ""}
  onChange={(e) => onSelectDriver(e.target.value)}
>
  {/* options */}
</Select>
```

**Verification:**
1. Visual comparison: dropdown should look identical
2. Functionality test: selecting drivers should work as before
3. No TypeScript errors

**Success Criteria:**
- Inline select replaced with modular Select
- Visual regression is zero
- Functionality is preserved
- Import statement added

**Estimated Time:** 10 minutes

---

### Task 3.3: Refactor strategy-builder.tsx
**Objective:** Replace all inline inputs, selects, and buttons with modular components (FR-6)

**File:** `/components/home/strategy-builder.tsx`

**Actions:**

#### Step 3.3.1: Add Imports
1. Add import: `import { Input, Select, Button } from '@/components/ui/inputs';`

#### Step 3.3.2: Replace Compound Select (lines 199-209)
**Before:**
```tsx
<select
  value={stint.compound}
  onChange={(e) => updateStint(index, "compound", e.target.value)}
  className="mt-1 w-full rounded-sm border border-white/10 bg-black/65 px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none"
>
  {tyres.map((tyre) => (
    <option key={tyre.compound} value={tyre.compound}>
      {t(`strategyBuilder.tireCompounds.${tyre.compound}`)}
    </option>
  ))}
</select>
```

**After:**
```tsx
<Select
  value={stint.compound}
  onChange={(e) => updateStint(index, "compound", e.target.value)}
>
  {tyres.map((tyre) => (
    <option key={tyre.compound} value={tyre.compound}>
      {t(`strategyBuilder.tireCompounds.${tyre.compound}`)}
    </option>
  ))}
</Select>
```

**Note:** The Select component has `w-full` in base styles, but this select needs custom width. Solution: Pass `className="w-full"` or adjust base styles to not force width.

#### Step 3.3.3: Replace fromLap Input (lines 213-222)
**Before:**
```tsx
<input
  type="number"
  min={index === 0 ? 1 : stints[index - 1].toLap + 1}
  max={stint.toLap}
  value={stint.fromLap}
  onChange={(e) => updateStint(index, "fromLap", parseInt(e.target.value) || 1)}
  disabled={index > 0}
  className="mt-1 w-full rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
  title={index > 0 ? "El inicio se ajusta automáticamente" : ""}
/>
```

**After:**
```tsx
<Input
  type="number"
  min={index === 0 ? 1 : stints[index - 1].toLap + 1}
  max={stint.toLap}
  value={stint.fromLap}
  onChange={(e) => updateStint(index, "fromLap", parseInt(e.target.value) || 1)}
  disabled={index > 0}
  className="mt-1 w-full"
  title={index > 0 ? "El inicio se ajusta automáticamente" : ""}
/>
```

#### Step 3.3.4: Replace toLap Input (lines 227-233)
**Before:**
```tsx
<input
  type="number"
  min={stint.fromLap}
  max={index === stints.length - 1 ? raceLaps : raceLaps}
  value={stint.toLap}
  onChange={(e) => updateStint(index, "toLap", parseInt(e.target.value) || stint.fromLap)}
  className="mt-1 w-full rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none"
/>
```

**After:**
```tsx
<Input
  type="number"
  min={stint.fromLap}
  max={index === stints.length - 1 ? raceLaps : raceLaps}
  value={stint.toLap}
  onChange={(e) => updateStint(index, "toLap", parseInt(e.target.value) || stint.fromLap)}
  className="mt-1 w-full"
/>
```

#### Step 3.3.5: Replace "Cover Race" Button (lines 167-174)
**Before:**
```tsx
<button
  type="button"
  onClick={autoFillStrategy}
  disabled={raceLaps <= 0}
  className="rounded-sm border border-white/10 px-2 py-1 text-xs text-zinc-300 transition hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
>
  {t('strategyBuilder.coverRace')}
</button>
```

**After:**
```tsx
<Button
  type="button"
  onClick={autoFillStrategy}
  disabled={raceLaps <= 0}
  variant="secondary"
>
  {t('strategyBuilder.coverRace')}
</Button>
```

#### Step 3.3.6: Replace "Add Stint" Button (lines 175-182)
**Before:**
```tsx
<button
  type="button"
  onClick={addStint}
  disabled={raceLaps <= 0}
  className="rounded-sm border border-red-500/60 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
>
  {t('strategyBuilder.addStint')}
</button>
```

**After:**
```tsx
<Button
  type="button"
  onClick={addStint}
  disabled={raceLaps <= 0}
  variant="primary"
>
  {t('strategyBuilder.addStint')}
</Button>
```

#### Step 3.3.7: Replace "Remove Stint" Button (lines 235-241)
**Before:**
```tsx
<button
  type="button"
  onClick={() => removeStint(index)}
  className="mb-0.5 rounded-sm px-2 py-1 text-xs text-zinc-500 transition hover:text-red-400 cursor-pointer disabled:cursor-not-allowed"
>
  {t('strategyBuilder.removeStint')}
</button>
```

**After:**
```tsx
<Button
  type="button"
  onClick={() => removeStint(index)}
  variant="ghost"
  className="mb-0.5"
>
  {t('strategyBuilder.removeStint')}
</Button>
```

#### Step 3.3.8: Replace "Auto-Fix" Button (lines 258-263)
**Before:**
```tsx
<button
  type="button"
  onClick={autoFixStrategy}
  className="mt-2 w-full rounded-sm border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300 transition hover:bg-yellow-400/20 cursor-pointer"
>
  ✓ {t('strategyBuilder.autoFix')}
</button>
```

**After:**
```tsx
<Button
  type="button"
  onClick={autoFixStrategy}
  variant="warning"
  className="mt-2 w-full"
>
  ✓ {t('strategyBuilder.autoFix')}
</Button>
```

**Verification:**
1. Visual comparison: all inputs, selects, and buttons should look identical
2. Functionality test:
   - Selecting compound works
   - Editing fromLap/toLap works
   - All buttons perform their actions correctly
   - Disabled states work
3. No TypeScript errors
4. No inline styling remains

**Success Criteria:**
- All 7 replacements completed successfully
- Visual regression is zero
- All functionality preserved
- Import statement added
- No inline input/select/button styling remains

**Estimated Time:** 30 minutes

---

## Phase 4: Verification and Testing

### Task 4.1: TypeScript Compilation Check
**Objective:** Ensure zero TypeScript errors after refactoring

**Actions:**
1. Run: `npm run build` or `npx tsc --noEmit`
2. Fix any TypeScript errors that arise
3. Verify all imports resolve correctly

**Success Criteria:**
- Zero TypeScript compilation errors
- All imports resolve successfully
- Build completes without warnings

**Estimated Time:** 5 minutes

---

### Task 4.2: Development Server Runtime Verification
**Objective:** Ensure application runs without runtime errors

**Actions:**
1. Start development server: `npm run dev`
2. Wait for server to initialize
3. Check terminal for any runtime errors
4. Verify hot reload works correctly

**Success Criteria:**
- Development server starts successfully
- No runtime errors in terminal
- No console errors in browser
- Application loads at http://localhost:3000

**Estimated Time:** 5 minutes

---

### Task 4.3: Visual Regression Testing
**Objective:** Ensure zero visual changes after refactoring

**Actions:**
1. Open application in browser
2. Navigate to race selector section
3. Compare visual appearance with pre-refactor screenshots
4. Navigate to driver selector section
5. Compare visual appearance with pre-refactor screenshots
6. Navigate to strategy builder section
7. Compare all inputs, selects, and buttons with pre-refactor screenshots
8. Check focus states, hover states, disabled states

**Components to Verify:**
- Race selector dropdown
- Driver selector dropdown
- Strategy builder:
  - Compound select dropdown
  - fromLap number input
  - toLap number input
  - "Cover Race" button
  - "Add Stint" button
  - "Remove Stint" button (inside stint card)
  - "Auto-Fix" button (in validation error box)

**Success Criteria:**
- All components look visually identical to pre-refactor state
- Focus states (red border) work correctly
- Hover states work correctly
- Disabled states are visually correct
- Spacing, padding, margins unchanged

**Estimated Time:** 15 minutes

---

### Task 4.4: Functional Testing
**Objective:** Ensure all interactive functionality works as before

**Test Cases:**

#### Test 4.4.1: Race Selector
1. Click race dropdown
2. Select a race
3. Verify race details display correctly (laps, temperature, rain, circuit)
4. Change selection multiple times
5. Verify state updates correctly

#### Test 4.4.2: Driver Selector
1. Click driver dropdown
2. Select a driver
3. Verify driver details display correctly (pace, consistency, car)
4. Change selection multiple times
5. Verify state updates correctly

#### Test 4.4.3: Strategy Builder - Add/Remove Stints
1. Click "Add Stint" button
2. Verify new stint appears
3. Click "Remove Stint" button
4. Verify stint is removed
5. Add multiple stints
6. Remove stints in different orders

#### Test 4.4.4: Strategy Builder - Edit Stints
1. Add a stint
2. Change compound via dropdown
3. Verify compound updates
4. Change toLap via number input
5. Verify fromLap of next stint auto-adjusts
6. Test min/max constraints on number inputs

#### Test 4.4.5: Strategy Builder - Cover Race Button
1. Select a race (to set raceLaps)
2. Click "Cover Race" button
3. Verify strategy auto-fills from lap 1 to raceLaps

#### Test 4.4.6: Strategy Builder - Auto-Fix Button
1. Create invalid strategy (gaps, wrong start/end)
2. Verify validation errors display
3. Click "Auto-Fix" button
4. Verify strategy is corrected automatically

#### Test 4.4.7: Disabled States
1. With no race selected (raceLaps = 0)
2. Verify "Add Stint" button is disabled
3. Verify "Cover Race" button is disabled
4. Add stints, verify fromLap input is disabled for non-first stints

**Success Criteria:**
- All test cases pass
- No functionality regressions
- All interactions work as expected
- State management unchanged

**Estimated Time:** 20 minutes

---

### Task 4.5: Edge Case Verification
**Objective:** Verify all edge cases from spec are handled correctly

**Test Cases:**

#### EC-1: Missing or Invalid Props
1. Manually set race/driver/stint to null/undefined
2. Verify components render without crashing

#### EC-2: ClassName Conflicts
1. Pass conflicting className to a component
2. Verify base structure classes remain intact

#### EC-3: Disabled Inputs with Event Handlers
1. Verify disabled inputs don't trigger onChange
2. Verify disabled buttons don't trigger onClick

#### EC-4: Number Input Validation
1. Try pasting non-numeric text into number inputs
2. Verify HTML5 native validation handles it

#### EC-5: Select Without Options
1. Temporarily remove all options from a select
2. Verify no runtime errors

#### EC-6: Button Type Default
1. Verify buttons without explicit type don't submit forms

**Success Criteria:**
- All edge cases handled gracefully
- No crashes or unexpected behavior

**Estimated Time:** 10 minutes

---

### Task 4.6: Code Quality Review
**Objective:** Ensure code follows constitution principles and best practices

**Review Checklist:**
- [ ] Simplicity: Are components as simple as possible?
- [ ] Functionality: Do components meet all FR requirements?
- [ ] Stability: Are there any potential bugs?
- [ ] SOLID principles: Single Responsibility achieved?
- [ ] No inline styling remains in refactored components
- [ ] TypeScript interfaces properly exported
- [ ] "use client" directive present in all components
- [ ] No `any` types used
- [ ] Proper prop forwarding with spread operator
- [ ] DisplayName set for all components (React DevTools)

**Success Criteria:**
- All checklist items pass
- Code follows constitution principles
- No code smells detected

**Estimated Time:** 10 minutes

---

## Phase 5: Documentation and Cleanup

### Task 5.1: Update MEMORY.md
**Objective:** Document the changes made and current project status

**Actions:**
1. Open `/MEMORY.md`
2. Add new entry documenting:
   - What was implemented (input component modularization)
   - What components were created
   - What components were refactored
   - Current status: modularization complete
   - Next steps: none (this spec is complete)

**Success Criteria:**
- MEMORY.md updated with accurate information
- Future developers understand what was changed

**Estimated Time:** 5 minutes

---

### Task 5.2: Create Checklist.md
**Objective:** Create implementation checklist for tracking progress

**Actions:**
1. Create file: `/spec/001-modularization/checklist.md`
2. List all tasks from this plan as checkboxes
3. Mark completed tasks as checked

**Success Criteria:**
- Checklist file exists
- All tasks listed
- Completion status accurate

**Estimated Time:** 5 minutes

---

### Task 5.3: Final Verification
**Objective:** Confirm Definition of Done from spec is met

**Definition of Done Checklist:**
- [ ] All three input components (Input, Select, Button) exist in `/components/ui/inputs/`
- [ ] Each component exports proper TypeScript interfaces
- [ ] All three existing components (race-selector, driver-selector, strategy-builder) are refactored to use modular inputs
- [ ] No inline input/select/button styling remains in home components
- [ ] The application runs without TypeScript or runtime errors
- [ ] Visual regression is zero — the UI looks identical to pre-refactor state
- [ ] All components follow the constitution principles (simplicity, functionality, stability, SOLID)

**Success Criteria:**
- All checklist items are checked
- Specification is 100% implemented

**Estimated Time:** 5 minutes

---

## Phase 6: Git Commit

### Task 6.1: Stage and Commit Changes
**Objective:** Commit the modularization refactor to version control

**Actions:**
1. Review all changed files: `git status`
2. Stage new component files: `git add components/ui/inputs/`
3. Stage refactored files: `git add components/home/`
4. Stage updated MEMORY.md and spec files
5. Create commit with descriptive message:
   ```
   feat: modularize input components (Input, Select, Button)
   
   - Created reusable UI primitives in /components/ui/inputs/
   - Refactored race-selector, driver-selector, strategy-builder to use modular components
   - Zero visual regression, maintains all existing functionality
   - Follows SOLID principles and constitution guidelines
   
   Implements spec/001-modularization/spec.md
   ```

**Success Criteria:**
- All changes committed
- Commit message is clear and descriptive
- Git history is clean

**Estimated Time:** 5 minutes

---

## Risk Mitigation

### Potential Risks and Mitigations

**Risk 1: ClassName Merging Issues**
- **Impact:** Custom classes may override base styles incorrectly
- **Mitigation:** Use proper className merging (template literals or clsx library)
- **Fallback:** Add custom className last in the string to allow overrides

**Risk 2: Select Component Width Discrepancy**
- **Impact:** Base Select has `w-full`, but compound select in strategy-builder may need different width
- **Mitigation:** Allow className prop to override width, or remove width from base styles
- **Fallback:** Pass explicit width via className prop

**Risk 3: TypeScript Compilation Errors**
- **Impact:** Props not correctly typed, causing compilation failures
- **Mitigation:** Extend proper HTML element attributes, test compilation after each component
- **Fallback:** Use `React.ComponentPropsWithoutRef` if needed

**Risk 4: Event Handler Type Mismatches**
- **Impact:** onChange handlers expect different event types
- **Mitigation:** Use native HTML event types, verify prop forwarding
- **Fallback:** Explicitly type event parameters

**Risk 5: Visual Regression**
- **Impact:** UI looks different after refactor
- **Mitigation:** Copy exact styling from original components, take before/after screenshots
- **Fallback:** Revert changes and adjust styles incrementally

---

## Rollback Plan

If critical issues arise during implementation:

1. **Immediate Rollback:**
   - Run: `git reset --hard HEAD` (if not committed)
   - Or: `git revert <commit-hash>` (if committed)

2. **Partial Rollback:**
   - Keep primitive components, revert refactored files
   - Implement primitives first, refactor later in separate commits

3. **Investigation:**
   - Isolate which component is causing issues
   - Fix specific component without rolling back entire change

---

## Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Setup | 2 tasks | 3 minutes |
| Phase 2: Primitives | 4 tasks | 55 minutes |
| Phase 3: Refactoring | 3 tasks | 50 minutes |
| Phase 4: Verification | 6 tasks | 65 minutes |
| Phase 5: Documentation | 3 tasks | 15 minutes |
| Phase 6: Git Commit | 1 task | 5 minutes |
| **Total** | **19 tasks** | **~3 hours** |

*Note: Times are estimates for an experienced developer familiar with the codebase.*

---

## Success Metrics

Implementation is successful when:

1. **Zero Visual Regression:** UI is pixel-perfect identical to original
2. **Zero Functional Regression:** All interactions work exactly as before
3. **Zero TypeScript Errors:** Clean compilation
4. **Zero Runtime Errors:** No console errors or crashes
5. **Code Quality:** Follows constitution and SOLID principles
6. **Maintainability:** Future style changes require editing only one location
7. **Reusability:** Components can be easily used in new features

---

## Next Steps After Completion

Once this plan is fully implemented:

1. **Optional Enhancements (Future Specs):**
   - Add label component wrapper
   - Add error message component
   - Add form validation helpers
   - Add input field group component
   - Add unit tests for primitives

2. **Monitor for Issues:**
   - Watch for any user-reported visual or functional issues
   - Be prepared to make minor adjustments if needed

3. **Document Learnings:**
   - Update MEMORY.md with any challenges faced
   - Note any deviations from the plan

---

## Appendix: Command Reference

**TypeScript Compilation:**
```bash
npm run build
# or
npx tsc --noEmit
```

**Development Server:**
```bash
npm run dev
```

**Git Commands:**
```bash
git status
git add <file>
git commit -m "message"
git reset --hard HEAD
git revert <commit-hash>
```

**Directory Creation (PowerShell):**
```powershell
New-Item -Path "components/ui/inputs" -ItemType Directory -Force
```

---

## References

- Specification: `/spec/001-modularization/spec.md`
- Constitution: `/docs/constitution.md`
- AGENTS.md: `/AGENTS.md`
- Existing Components: `/components/home/*.tsx`
- UI Directory: `/components/ui/`

---

**Plan Status:** Ready for Implementation  
**Last Updated:** 2026-11-02  
**Plan Version:** 1.0
