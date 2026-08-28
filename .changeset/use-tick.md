---
'solid-pixi': minor
---

Add `useTick`, which runs a callback on the application's ticker for the life
of the component.

The callback runs inside `flush`, so the signal and store writes it makes
commit on the frame that made them rather than a frame late. That is the whole
reason to reach for it over `app.ticker.add`, which leaves the flush to the
caller.

```diff
-app.ticker.add(() => {
-  flush(() => setCount(c => c + 0.1))
-})
+useTick(() => setCount(c => c + 0.1))
```

The listener is added on mount with `priority` when one is given, and removed
on cleanup. An `enabled` accessor attaches and detaches it as the value flips,
which is how a scene pauses per-frame work without tearing the component down:

```tsx
useTick(spin, { priority: UPDATE_PRIORITY.HIGH, enabled: () => !paused() })
```

`useTick` calls `useApplication`, so it belongs in component setup under an
`<Application>`.
