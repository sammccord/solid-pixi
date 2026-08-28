---
'solid-pixi': major
---

Destroy nodes that control flow removes.

A `<Show>` or `<For>` exit used to detach its nodes and leave them alive, so a
scene that churned through them accumulated undestroyed Text textures and
Graphics contexts for as long as the app ran. Removal now destroys the removed
subtree bottom-up. `destroy()` is called with no options, so a node frees the
resources it owns and the textures it merely borrows are left alone.

Instances adopted through `as` are exempt. The scene did not create them, so it
detaches them and never destroys them. `render()`'s dispose is unchanged as
well, leaving the mounted tree attached and undestroyed.

Code that pulled a node out of the tree and kept using it has to own that node
itself now, by constructing it and passing it in through `as`.
