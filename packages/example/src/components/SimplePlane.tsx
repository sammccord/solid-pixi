import { Application, Asset, SimplePlane, useApp } from "solid-pixi";

function Grass() {
  const app = useApp();

  return (
    <Asset urls="/bg_grass.jpg">
      {(texture) => (
        <SimplePlane
          texture={texture}
          verticesX={10}
          verticesY={10}
          x={100}
          y={100}
          use={(plane) => {
            const buffer = plane.geometry.getBuffer("aVertexPosition");
            let timer = 0;
            const update = () => {
              for (let i = 0; i < buffer.data.length; i++) {
                buffer.data[i] += Math.sin(timer / 10 + i) * 0.5;
              }
              buffer.update();
              timer++;
            };
            app?.ticker.add(update);
            return () => app?.ticker.remove(update);
          }}
        />
      )}
    </Asset>
  );
}

export default function SimplePlanePage() {
  return (
    <Application background="#1099bb">
      <Grass />
    </Application>
  );
}
