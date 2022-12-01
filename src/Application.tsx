import { Application as pxApplication, IApplicationOptions } from "pixi.js";
import { createContext, splitProps, useContext } from "solid-js";
import { ParentContext } from "./ParentContext";

export const AppContext = createContext<pxApplication>();
export const useApp = () => useContext(AppContext);

export interface ApplicationProps extends Partial<IApplicationOptions> {
  children?: any;
}

export function Application(props: ApplicationProps) {
  const [ours, pixis] = splitProps(props, ["children"]);

  const app = new pxApplication(pixis);

  return (
    <AppContext.Provider value={app}>
      <ParentContext.Provider value={app.stage}>
        {app && ours.children}
      </ParentContext.Provider>
      {app.view}
    </AppContext.Provider>
  );
}
