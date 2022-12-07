import { ObservablePoint, Rectangle, Renderer, Texture } from "pixi.js";
import { For } from "solid-js";
import {
  Application,
  ExtendedSprite,
  ParticleContainer,
  Sprite,
  useApp,
  useParent,
} from "solid-pixi";

const texture = Texture.from("/maggot_tiny.png");
texture.defaultAnchor = { x: 0.5, y: 0.5 } as ObservablePoint;

type Maggot = {
  direction: number;
  turningSpeed: number;
  speed: number;
  offset: number;
};

function Maggots() {
  const app = useApp();
  const container = useParent();
  const totalSprites = app?.renderer instanceof Renderer ? 10000 : 100;

  const dudeBoundsPadding = 100;
  const dudeBounds = new Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app!.screen.width + dudeBoundsPadding * 2,
    app!.screen.height + dudeBoundsPadding * 2
  );

  let tick = 0;
  app?.ticker.add(() => {
    for (let i = 0; i < container.children.length; i++) {
      const dude = container.children[i] as ExtendedSprite<Maggot>;
      dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
      dude.direction += dude.turningSpeed * 0.01;
      dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
      dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
      dude.rotation = -dude.direction + Math.PI;

      // wrap the maggots
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

    tick += 0.1;
  });

  return (
    <For each={Array.from({ length: totalSprites })}>
      {() => {
        const scale = 0.8 + Math.random() * 0.3;
        return (
          <Sprite<Maggot>
            texture={[texture]}
            scale={{ x: scale, y: scale }}
            x={Math.random() * app!.screen.width}
            y={Math.random() * app!.screen.height}
            tint={Math.random() * 0x808080}
            direction={Math.random() * Math.PI * 2}
            turningSpeed={Math.random() - 0.8}
            speed={(2 + Math.random() * 2) * 0.2}
            offset={Math.random() * 100}
          />
        );
      }}
    </For>
  );
}

export default function ParticleContainerPage() {
  return (
    <Application>
      <ParticleContainer
        maxSize={10000}
        properties={{
          scale: true,
          position: true,
          rotation: true,
          uvs: true,
          alpha: true,
        }}
      >
        <Maggots />
      </ParticleContainer>
    </Application>
  );
}
