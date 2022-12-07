import { ObservablePoint, Texture } from "pixi.js";
import { Application, Sprite, useApp } from "solid-pixi";

const texture = Texture.from("/bunny.png");
texture.defaultAnchor = { x: 0.5, y: 0.5 } as ObservablePoint;

function Bunny() {
  const app = useApp();
  return (
    <Sprite
      from={texture}
      use={(sprite) => {
        const rotate = () => (sprite.rotation += 0.01);
        app?.ticker.add(rotate);
        return () => app?.ticker.remove(rotate);
      }}
      x={(app?.screen.width || 0) / 2}
      y={(app?.screen.height || 0) / 2}
    />
  );
}

export default function TransparentBackground() {
  return (
    <Application backgroundAlpha={0}>
      <Bunny />
    </Application>
  );
}
