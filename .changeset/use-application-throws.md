---
'solid-pixi': major
---

`useApplication` no longer returns `undefined`.

It was typed `PixiApplication | undefined` because there was nothing to hand
back outside an `<Application>`, which pushed a `!` or a `?.` onto every call
site for a case none of them could do anything about. It now returns
`PixiApplication` and throws `useApplication must be called under
<Application>` when the context is missing.

```diff
-<Sprite x={app!.screen.width / 2} y={app!.screen.height / 2} />
+<Sprite x={app.screen.width / 2} y={app.screen.height / 2} />
```

Callers delete their `!` and `?.`. A component that reaches for the app is
either inside an `<Application>` or is a bug, and the error says which.
