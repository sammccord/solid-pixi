import { Container as pxContainer, ObservablePoint, Texture } from "pixi.js";
import { For } from "solid-js";
import {
  Application,
  Asset,
  Container,
  ContainerProps,
  Sprite,
  useApp,
} from "solid-pixi";

interface OtherProps {
  foo: "bar";
}

export default function ContainerPage() {
  return (
    <Application background="#1099bb">
      <RotatingHalvedContainer>
        <Asset<Texture, OtherProps>
          component={Bunnies}
          urls={"/bunny.png"}
          foo="bar"
        ></Asset>
      </RotatingHalvedContainer>
    </Application>
  );
}

function Bunnies(props: { texture: Texture } & OtherProps) {
  console.log(props.foo);
  return (
    <For each={Array.from({ length: 25 })}>
      {(_, i) => (
        <Sprite
          from={props.texture}
          x={(i() % 5) * 40}
          y={Math.floor(i() / 5) * 40}
        />
      )}
    </For>
  );
}

function RotatingHalvedContainer(props: ContainerProps) {
  const app = useApp();

  return (
    <Container
      {...props}
      use={(container: pxContainer) => {
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
