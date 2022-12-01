import { IPointData, TextStyle } from "pixi.js";
import {
  createSignal,
  createUniqueId,
  For,
  onCleanup,
  onMount,
} from "solid-js";
import { Application, Container, Sprite, Text } from "..";

function use(val) {
  console.log(val);
  return (sprite) => {
    console.log(sprite);

    return () => {
      console.log("cleaning up");
    };
  };
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
      <Text
        text={sprites().join(" ")}
        x={50}
        y={10}
        style={
          new TextStyle({
            fontFamily: "Arial",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: "bold",
            fill: ["#ffffff", "#00ff99"], // gradient
            stroke: "#4a1850",
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: "#000000",
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
            lineJoin: "round",
          })
        }
      />
      <For each={sprites()}>
        {(id, i) => (
          <Sprite
            name={id}
            from="/sprite.png"
            position={i() === 0 ? pos() : { x: 0, y: 0 }}
            interactive={i() % 2 === 0}
            on:click={() => console.log(i())}
            zIndex={i()}
            // use={[use(i() % 2 === 0)]}
          />
        )}
      </For>
    </Application>
  );
}

export default App;
