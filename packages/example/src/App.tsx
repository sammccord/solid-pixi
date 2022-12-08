import { Routes, Route } from "@solidjs/router";
import IndexPage from "./pages/Index";
import BlendModes from "./components/BlendModes";
import CacheAsBitmap from "./pages/CacheAsBitmap";
import Container from "./pages/Container";
import ParticleContainerPage from "./pages/ParticleContainer";
import SimplePlanePage from "./pages/SimplePlane";
import Tinting from "./pages/Tinting";
import TransparentBackground from "./pages/TransparentBackground";

export default function App() {
  return (
    <>
      <header>
        <h1>Solid PIXI</h1>
        <p>WIP Custom Renderer for PIXI.js</p>
        <nav>
          <a href="https://solid-pixi-docs.netlify.app/" target="_blank">
            Docs
          </a>
        </nav>
      </header>
      <aside>
        <ul>
          <li>
            Basic PIXI Examples
            <ul>
              <li>
                <a href="/container">Container</a>
              </li>
              <li>
                <a href="/transparent-background">Transparent Background</a>
              </li>
              <li>
                <a href="/tinting">Tinting</a>
              </li>
              <li>
                <a href="/cache-as-bitmap">Cache As Bitmap</a>
              </li>
              <li>
                <a href="/particle-container">Particle Container</a>
              </li>
              <li>
                <a href="/blendmodes">Blendmodes</a>
              </li>
              <li>
                <a href="/simple-plane">Simple Plane</a>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
      <main>
        <Routes>
          <Route path="/" component={Container} />
          <Route path="/container" component={Container} />
          <Route
            path="/transparent-background"
            component={TransparentBackground}
          />
          <Route path="/tinting" component={Tinting} />
          <Route path="/cache-as-bitmap" component={CacheAsBitmap} />
          <Route path="/particle-container" component={ParticleContainerPage} />
          <Route path="/blendmodes" component={BlendModes} />
          <Route path="/simple-plane" component={SimplePlanePage} />
        </Routes>
      </main>
    </>
  );
}
