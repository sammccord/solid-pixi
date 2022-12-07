import { BLEND_MODES, ObservablePoint, Rectangle, Texture } from "pixi.js";
import { For } from "solid-js";
import {
  Application,
  Container,
  ExtendedSprite,
  Sprite,
  useApp,
  useParent,
} from "solid-pixi";

const background = Texture.from("/bg_rotate.jpg");

const dude = Texture.from("/flowerTop.png");
dude.defaultAnchor = { x: 0.5, y: 0.5 } as ObservablePoint;

type Dude = {
  direction: number;
  turningSpeed: number;
  speed: number;
  offset: number;
};

function Dudes() {
  const app = useApp();
  const parent = useParent();

  const dudeBoundsPadding = 100;
  const dudeBounds = new Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app!.screen.width + dudeBoundsPadding * 2,
    app!.screen.height + dudeBoundsPadding * 2
  );

  app?.ticker.add(() => {
    for (let i = 0; i < parent.children.length; i++) {
      const dude = parent.children[i] as ExtendedSprite<Dude>;
      dude.direction += dude.turningSpeed * 0.01;
      dude.x += Math.sin(dude.direction) * dude.speed;
      dude.y += Math.cos(dude.direction) * dude.speed;
      dude.rotation = -dude.direction - Math.PI / 2;

      // wrap the dudes by testing their bounds...
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
    <For each={Array.from({ length: 20 })}>
      {() => {
        const scale = 0.8 + Math.random() * 0.3;
        return (
          <Sprite<Dude>
            texture={[dude]}
            blendMode={BLEND_MODES.ADD}
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

function Background() {
  const app = useApp();
  return (
    <Sprite
      texture={[background]}
      width={app?.screen.width}
      height={app?.screen.height}
    />
  );
}

export default function BlendModes() {
  return (
    <Application>
      <Background />
      <Container>
        <Dudes />
      </Container>
    </Application>
  );
}
