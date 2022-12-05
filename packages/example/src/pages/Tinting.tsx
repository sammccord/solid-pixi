import { ObservablePoint, Rectangle, Texture, Ticker } from "pixi.js";
import { createEffect, createSignal, For } from "solid-js";
import { Application, ExtendedSprite, Sprite, useApp } from "solid-pixi";

const texture = Texture.from("/eggHead.png");
texture.defaultAnchor = { x: 0.5, y: 0.5 } as ObservablePoint;

function Dudes() {
  const app = useApp();
  const dudes = Array.from({ length: 20 }).map(() => {
    const scale = 0.8 + Math.random() * 0.3;
    return {
      direction: Math.random() * Math.PI * 2,
      x: Math.random() * app!.screen.width,
      y: Math.random() * app!.screen.height,
      rotation: 0,
      turningSpeed: Math.random() - 0.8,
      speed: 2 + Math.random() * 2,
      tint: Math.random() * 0xffffff,
      scale: { x: scale, y: scale },
    };
  });

  const dudeBoundsPadding = 100;
  const dudeBounds = new Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app!.screen.width + dudeBoundsPadding * 2,
    app!.screen.height + dudeBoundsPadding * 2
  );

  app?.ticker.add(() => {
    for (let i = 0; i < app.stage.children.length; i++) {
      const dude = app.stage.children[i] as ExtendedSprite<{
        speed: number;
        direction: number;
        turningSpeed: number;
      }>;
      const newDirection = dude.direction + dude.turningSpeed * 0.01;
      dude.direction = newDirection;
      dude.x += Math.sin(dude.direction) * dude.speed;
      dude.y += Math.cos(dude.direction) * dude.speed;
      dude.rotation = -newDirection - Math.PI / 2;
      if (dude.x < dudeBounds.x) {
        dude.x += dudeBounds.width;
      } else if (dude.x > dudeBounds.x + dudeBounds.width) {
        dude.x -= dudeBounds.width;
      }

      if (dude.y < dudeBounds.y) {
        dude.y += dudeBounds.height;
      } else if (dude.y > dudeBounds.y + dudeBounds.height) {
        dude.y -= dudeBounds.height;
      }
    }
  });

  return (
    <For each={dudes}>
      {(dude) => (
        <Sprite<{ speed: number; direction: number; turningSpeed: number }>
          from={texture}
          scale={dude.scale}
          x={dude.x}
          y={dude.y}
          rotation={dude.rotation}
          tint={dude.tint}
          direction={dude.direction}
          turningSpeed={dude.turningSpeed}
          speed={dude.speed}
        />
      )}
    </For>
  );
}

export default function Tinting() {
  return (
    <Application>
      <Dudes />
    </Application>
  );
}
