import { Routes, Route } from "@solidjs/router";
import BlendModes from "./pages/BlendModes";
import CacheAsBitmap from "./pages/CacheAsBitmap";
import Container from "./pages/Container";
import ParticleContainerPage from "./pages/ParticleContainer";
import SimplePlanePage from "./pages/SimplePlane";
import Tinting from "./pages/Tinting";
import TransparentBackground from "./pages/TransparentBackground";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Test</div>} />

      <Route path="/container" component={Container} />
      <Route path="/transparent-background" component={TransparentBackground} />
      <Route path="/tinting" component={Tinting} />
      <Route path="/cache-as-bitmap" component={CacheAsBitmap} />
      <Route path="/particle-container" component={ParticleContainerPage} />
      <Route path="/blendmodes" component={BlendModes} />
      <Route path="/simple-plane" component={SimplePlanePage} />
    </Routes>
  );
}
