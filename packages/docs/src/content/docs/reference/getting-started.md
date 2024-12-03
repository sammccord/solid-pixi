---
title: Getting Started
description: Start using solid-pixi
---

Install `solid-pixi`

`npm install --save pixi.js solid-js solid-pixi`

If you need to execute code in environments that don't support `new Function`, use `solid-pixi-unsafe` instead.

The library has no dependencies, but requires `pixi.js` and `solid-js` as a peers.

And in your application:

```tsx
import { Application } from 'solid-pixi/Application'
// or
import { Application } from 'solid-pixi'

export function App() {
  return <Application></Application>
}
```
