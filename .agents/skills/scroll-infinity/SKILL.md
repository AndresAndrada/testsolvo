---
name: scroll-infinity
description: Guidelines and best practices for implementing, debugging, or refactoring infinite scroll and real-time pagination functionality in modern web applications using React, Next.js, the Intersection Observer API, or TanStack Query, specifically handling batched pagination of 10 items at a time (+10 on scroll end).
---

# Infinite Scroll Implementation Guidelines (Paginated Batches of 10)

This skill covers the technical standards, design patterns, and optimization rules for implementing infinite scroll functionality efficiently, specifically configured to fetch and display items in increments of 10 (`+10` results upon reaching the end of the scroll), ensuring it remains free from performance issues or infinite loops.

## 1. Fundamental Principles
- **Chunked Pagination (Batches of 10):** Configure the backend or local data source to load an initial batch of 10 items, subsequently appending exactly 10 more items (`+10`) with each trigger event until the total dataset is exhausted.
- **List Virtualization:** For long lists (exceeding 100 items), implement or utilize virtualization (e.g., `@tanstack/react-virtual` or `react-window`) to prevent DOM overload.
- **Efficient Detection:** Use the native `Intersection Observer` API or specialized hooks (e.g., `react-intersection-observer`) instead of attaching listeners directly to the window's `scroll` event (`window.addEventListener('scroll')`).
- **State Management:** Strictly manage four key states: `idle`, `loading`, `hasMore` (or `hasNextPage`), and `error`.

## 2. Implementation Rules

### A. Request Handling and Race Conditions
- Prevent duplicate requests or redundant triggers by ensuring the loading function only executes when `!isLoading && hasMore && isIntersecting` is true.
- Manage the pagination offset or page index so that each fetch request explicitly requests the next block of 10 items.
- Ensure each item has a unique `key` for rendering to avoid unnecessary re-renders in React.

### B. Accessibility (a11y) and User Experience (UX)
- Always include a clear loading indicator—such as a *loading skeleton* or a *spinner*—at the bottom of the list while the next batch of 10 items is being fetched.
- Provide a retry mechanism (*Retry Button*) if a request fails, rather than leaving the screen frozen.
- Include a fallback option or a "Load More (+10)" button for users relying on assistive technologies or those using mobile devices with limited resources.