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

  onMount(() => {
    const t = () => {
      console.log("pushing");
      setSprites([...sprites(), createUniqueId()]);
    };
    const i = setInterval(t, 5000);

    onCleanup(() => clearInterval(i));
  });

  return (
    <Application>
      <For each={sprites()}>
        {(id) => <Sprite name={id} from="/sprite.png" />}
      </For>
    </Application>
  );
}

export default App;
