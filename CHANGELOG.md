# Changelog

## [1.1.0] - 2026-03-08

### Breaking Changes
- Removed `collisionDetection` and `customCollisionElements` from `AdvancedConfig` (were unimplemented)
- `onCollision` callback type changed from `"wall" | "mouse" | "element"` to `"wall" | "mouse"`
- Internal utility functions and hooks are no longer exported from the public API

### Performance
- **Migrated animation loop from `setInterval` to `requestAnimationFrame`** — eliminates the teardown/setup cycle that occurred every frame
- **Refactored `useWandererState`** — returns refs instead of `.current` snapshots, preventing unnecessary effect re-triggers
- Wrapped `Wanderer` component with `React.memo` to prevent unnecessary re-renders
- All state setter functions are now wrapped with `useCallback` for stable references
- Implemented `enablePerformanceMode` — skips every other frame for reduced CPU usage

### Added
- Centralized type definitions in `src/types.ts` — eliminates interface duplication across 5 files
- Auto-injection of `@keyframes spin` CSS — consumers no longer need to define it
- Props validation: width/height are clamped to `>= 0`
- `typecheck` npm script (`tsc --noEmit`)
- GitHub Actions CI pipeline (lint, typecheck, test, build across Node 18/20/22)
- This CHANGELOG

### Fixed
- Resolved 12 of 14 npm vulnerabilities (remaining 2 are in `@microsoft/api-extractor`, a transitive dependency)
- Removed all `eslint-disable-next-line react-hooks/exhaustive-deps` comments by restructuring hook dependencies
- ESLint warning for missing `"type": "module"` in package.json

### Changed
- Moved `prismjs` and `@types/prismjs` from `dependencies` to `devDependencies` (only used in demo)
- Aligned `@vitest/coverage-v8` version with `vitest`
- Restricted public API exports to only: component, types, and default configurations
- Translated all source code comments from French to English

## [1.0.0] - 2025-01-01

- Initial release
