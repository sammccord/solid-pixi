import { ObservablePoint, Texture } from "pixi.js";
import { For } from "solid-js";
import {
  Application,
  Container,
  ContainerProps,
  Sprite,
  useApp,
} from "solid-pixi";

const texture = Texture.from("/bunny.png");
texture.defaultAnchor = { x: 0.5, y: 0.5 } as ObservablePoint;

export default function ContainerPage() {
  return (
    <Application background="#1099bb">
      <RotatingHalvedContainer>
        <For each={Array.from({ length: 25 })}>
          {(_, i) => (
            <Sprite
              from={texture}
              x={(i() % 5) * 40}
              y={Math.floor(i() / 5) * 40}
            />
          )}
        </For>
      </RotatingHalvedContainer>
    </Application>
  );
}

function RotatingHalvedContainer(props: ContainerProps) {
  const app = useApp();

  return (
    <Container
      {...props}
      use={(container) => {
        const update = (delta: number) => {
          container.rotation -= 0.01 * delta;
        };
        app?.ticker.add(update);

        // unfortunately not all children's properties have been set by the time the use exists
        setTimeout(() => {
          container.pivot.set(container.width / 2, container.height / 2);
        });
        return () => app?.ticker.remove(update);
      }}
      x={(app?.screen?.width || 0) / 2}
      y={(app?.screen?.height || 0) / 2}
    >
      {props.children}
    </Container>
  );
}
