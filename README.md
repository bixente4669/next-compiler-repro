# SWC 56 skips React Compiler for `.ts` files with bare generic arrow functions

Minimal reproduction for [vercel/next.js#91791](https://github.com/vercel/next.js/issues/91791).

## The bug

A bare `<T>` generic on an arrow function in a `.ts` file causes SWC's `isReactCompilerRequired()` to skip the **entire file**. All hooks in the file silently lose React Compiler memoization. No warning is emitted.

`app/useMyHook.ts`:
```ts
import { useState } from 'react';

const useMyHook = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  return { setValue, value };
};

export default useMyHook;
```

## Reproduce

```bash
bun install
bun dev
```

Open http://localhost:3000, then check `.next/dev/static/chunks/` for the chunk containing `useMyHook`. It will use `useState` directly — no `compiler-runtime`, no cache.

Adding a trailing comma (`<T,>`) or a default (`<T = unknown>`) fixes it — SWC can then distinguish the generic from JSX.

## Bisect

| Version | Compiled? |
|---|---|
| 16.2.0-canary.41 (SWC 55) | Yes |
| **16.2.0-canary.42 (SWC 56)** | **No** |
| 16.2.1 | No |

Introduced by commit `1fac9a1` — "Upgrade to swc 56" ([PR #89111](https://github.com/vercel/next.js/pull/89111)).
