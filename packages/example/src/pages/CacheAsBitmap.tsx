import { Assets, IPointData, ObservablePoint, Ticker } from "pixi.js";
import { createEffect, createSignal, For, onMount } from "solid-js";
import { Application, Container, Sprite, useApp, useParent } from "solid-pixi";

Ticker.shared.speed = 0.1;
const alienFrames = [
  "eggHead.png",
  "flowerTop.png",
  "helmlok.png",
  "skully.png",
];
let count = 0;

function Aliens() {
  const [aliens, setAliens] = createSignal<
    {
      frameName: string;
      tint: number;
      x: number;
      y: number;
      anchor: IPointData;
    }[]
  >([]);
  const [loaded, setLoaded] = createSignal(false);
  const app = useApp();
  const container = useParent();

  onMount(() => {
    Assets.load("/monsters.json").then(() => {
      setLoaded(true);
      app!.start();
    });
    app?.stage.on("pointertap", () => {
      console.log(container.cacheAsBitmap);
      container!.cacheAsBitmap = !container?.cacheAsBitmap;
    });

    app?.ticker.add(() => {
      for (let i = 0; i < container.children.length; i++) {
        const alien = container.children[i];
        alien.rotation += 0.1;
      }
      count += 0.01;
      container.scale.x = Math.sin(count);
      container.scale.y = Math.sin(count);
      container.rotation += 0.1;
    });
  });

  createEffect(() => {
    if (loaded()) {
      setAliens(
        Array.from({ length: 100 }).map((_, i) => ({
          frameName: alienFrames[i % 4],
          tint: Math.random() * 0xffffff,
          x: Math.random() * 800 - 400,
          y: Math.random() * 600 - 300,
          anchor: { x: 0.5, y: 0.5 },
        }))
      );
    }
  });

  return (
    <For each={aliens()}>
      {(alien) => {
        return (
          <Sprite
            from={alien.frameName}
            tint={alien.tint}
            x={alien.x}
            y={alien.y}
            anchor={alien.anchor as ObservablePoint}
          />
        );
      }}
    </For>
  );
}

export default function CacheAsBitmap() {
  return (
    <Application
      use={(app) => {
        app.stage.interactive = true;
        app.stop();
      }}
    >
      <Container x={400} y={300}>
        <Aliens />
      </Container>
    </Application>
  );
}
