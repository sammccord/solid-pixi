import { IPointData, Rectangle, Transform } from "pixi.js";
import {
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  onMount,
} from "solid-js";
import { Application, Sprite } from "..";
import Cool from "./Cool";

function use(val) {
  console.log(val.name);
  // return (t) => {
  //   console.log(t.name);
  // };
}

function App() {
  const [sprites, setSprites] = createSignal<string[]>([]);
  const [pos, setPos] = createSignal<IPointData>({ x: 0, y: 0 });

  onMount(() => {
    const i = setInterval(() => {
      if (sprites().length > 5) {
        setSprites([]);
        clearInterval(i);
        return;
      }
      setSprites([...sprites(), createUniqueId()]);
      setPos((pos) => ({ x: (pos.x += 10), y: (pos.y += 10) }));
    }, 2000);

    onCleanup(() => clearInterval(i));
  });

  return (
    <Application>
      <Cool />
      {/* <For each={sprites()}>
        {(id, i) => (
          <Sprite
            name={id}
            from="/sprite.png"
            position={i() === 0 ? pos() : { x: 0, y: 0 }}
            interactive={i() % 2 === 0}
            on:click={() => console.log(i())}
            zIndex={i()}
            use={use}
          />
        )}
      </For> */}
    </Application>
  );
}

export default App;
