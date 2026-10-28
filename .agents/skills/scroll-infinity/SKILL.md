---
name: scroll-infinity
description: Guidelines and best practices for implementing, debugging, or refactoring infinite scroll and real-time pagination functionality in modern web applications using React, Next.js, the Intersection Observer API, or TanStack Query.
---

# Infinite Scroll Implementation Guidelines

This skill covers the technical standards, design patterns, and optimization rules for implementing infinite scroll functionality efficiently, ensuring it remains free from performance issues or infinite loops.

## 1. Fundamental Principles
- **List Virtualization:** For long lists (exceeding 100 items), implement or utilize virtualization (e.g., `@tanstack/react-virtual` or `react-window`) to prevent DOM overload.
- **Efficient Detection:** Use the native `Intersection Observer` API or specialized hooks (e.g., `react-intersection-observer`) instead of attaching listeners directly to the window's `scroll` event (`window.addEventListener('scroll')`).
- **State Management:** Strictly manage four key states: `idle`, `loading`, `hasMore` (or `hasNextPage`), and `error`.

## 2. Implementation Rules

### A. Request Handling and Race Conditions
- Prevent duplicate requests or redundant triggers by ensuring the loading function only executes when `!isLoading && hasMore && isIntersecting` is true.
- Use **debounce** or **throttle** techniques if your detection logic relies on scroll coordinates or high-frequency events.
- Ensure each item has a unique `key` for rendering to avoid unnecessary re-renders in React.

### B. Accessibility (a11y) and User Experience (UX)
- Always include a clear loading indicator—such as a *loading skeleton* or a *spinner*—at the bottom of the list while additional data is being fetched. - Provide a retry mechanism (*Retry Button*) if a request fails, rather than leaving the screen frozen.
- Include a fallback option or a "Load More" button for users relying on assistive technologies or those using mobile devices with limited resources.