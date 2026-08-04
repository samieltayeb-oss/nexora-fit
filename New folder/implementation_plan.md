# Goal Description

Sprint 2 focuses on establishing **UX Resilience**. Nexora Health will no longer fail silently, show blank screens while loading, or leave users confused when they have no data. We will introduce a premium loading architecture, robust error boundaries, educational empty states, offline support via a Service Worker, and fluid motion transitions across the application. 

Additionally, we will re-brand the deployment to align with the "Nexora Health" identity.

## User Review Required

> [!WARNING]  
> **Offline Support Strategy:** Implementing a Service Worker in Next.js App Router can sometimes introduce aggressive caching that complicates development. I propose using `@serwist/next` (the modern successor to `next-pwa`) configured specifically to cache static assets and offline fallbacks without permanently caching dynamic API routes. 

> [!IMPORTANT]  
> **Deployment Rebranding:** I will rename the Vercel project from `NEXORA-FIT` to `nexora-health`. Vercel will automatically provision a new default URL (e.g., `nexora-health.vercel.app`). We can map this to a custom domain like `health.nexora.ai` later via your DNS provider.

## Open Questions

> [!CAUTION]  
> Do you have a preferred icon set or illustration style for the Empty States? If not, I will use polished Lucide icons mixed with the brand's primary color system to keep it looking premium.

## Proposed Changes

---

### 1. Deployment & Branding

Rename the Vercel project to align with the Nexora brand identity.

#### [MODIFY] Vercel Settings
- Rename Vercel project to `nexora-health`.
- Update the `package.json` name from `NEXORA-FIT` to `nexora-health`.

---

### 2. Design System Components

Introduce the core UI components required for resilience.

#### [NEW] `src/components/ui/skeleton.tsx`
- A reusable, animating skeleton loader using a pulsing shimmer effect.
#### [NEW] `src/components/ui/empty-state.tsx`
- A premium empty state component displaying an icon, a helpful educational message, and a primary call-to-action button.
#### [NEW] `src/components/ui/page-transition.tsx`
- A wrapper using `framer-motion` that fades and slightly slides pages into view during route changes.

---

### 3. Loading Architecture

Eliminate blank screens during Next.js server component resolution and data fetching.

#### [NEW] `src/app/(app)/dashboard/loading.tsx`
#### [NEW] `src/app/(app)/progress/loading.tsx`
#### [NEW] `src/app/(app)/workout/loading.tsx`
#### [NEW] `src/app/(app)/waistline/loading.tsx`
- Each `loading.tsx` will render a specialized skeleton layout mirroring the structure of its target page.

---

### 4. Error Boundaries & Recovery

Ensure the user never encounters a white screen of death or an unhandled exception.

#### [NEW] `src/app/(app)/error.tsx`
- A global boundary for the authenticated app. Displays a beautiful error illustration with "Try again" (using Next.js `reset()`) and "Return Home" recovery buttons.
#### [NEW] `src/app/global-error.tsx`
- A root-level error boundary capturing extreme rendering failures outside the app layout.

---

### 5. Educational Empty States

Replace raw data checks with educational guidance.

#### [MODIFY] `src/app/(app)/dashboard/page.tsx`
- Render `EmptyState` guiding the user to start their first workout if no sessions exist.
#### [MODIFY] `src/app/(app)/workout/library/page.tsx`
- Render `EmptyState` explaining how to create custom exercises/templates if the library is empty.
#### [MODIFY] `src/app/(app)/progress/page.tsx`
- Render `EmptyState` prompting the user to log their first metric.

---

### 6. Offline Reliability & Motion

Make the app feel fast, fluid, and robust against network drops.

#### [MODIFY] `package.json`
- Install `framer-motion`.
- Install `@serwist/next` (PWA/Service Worker integration).
#### [MODIFY] `next.config.mjs`
- Wrap configuration with `withSerwist` to generate a service worker that caches the app shell for offline availability.
#### [NEW] `src/components/offline-indicator.tsx`
- A discreet toast/banner that appears when `navigator.onLine` is false, reassuring the user that their data will sync when connectivity returns.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure `Serwist` successfully injects the service worker without breaking the build.
- Run `npm run lint` and TypeScript checks.

### Manual Verification
- Throttle network to "Offline" in Chrome DevTools and verify that the app still renders the shell and displays the `OfflineIndicator`.
- Manually trigger an error in the dashboard to verify the `error.tsx` recovery flow.
- Ensure transitions feel perfectly intentional and snappy when navigating between routes.
