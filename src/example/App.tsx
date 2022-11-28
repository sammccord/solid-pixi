import { IPointData, Rectangle, Transform } from "pixi.js";
import {
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  onMount,
} from "solid-js";
import { Application, Sprite } from "..";

function App() {
  const [sprites, setSprites] = createSignal<string[]>([]);
  const [pos, setPos] = createSignal<IPointData>({ x: 0, y: 0 });

  onMount(() => {
    const i = setInterval(() => {
      if (sprites().length > 1) {
        setSprites([]);
        clearInterval(i);
        return;
      }
      setSprites([...sprites(), createUniqueId()]);
      setPos((pos) => ({ x: (pos.x += 10), y: (pos.y += 10) }));
    }, 3000);

    onCleanup(() => clearInterval(i));
  });

  return (
    <Application>
      <For each={sprites()}>
        {(id, i) => (
          <Sprite
            name={id}
            from="/sprite.png"
            position={i() === 0 ? pos() : { x: 0, y: 0 }}
            interactive={i() % 2 === 0}
            on:click={() => console.log(i())}
            zIndex={i()}
          />
        )}
      </For>
    </Application>
  );
}

export default App;
