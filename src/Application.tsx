import { Application as pxApplication, IApplicationOptions } from "pixi.js";
import { createContext, createEffect, splitProps, useContext } from "solid-js";
import { CommonPropKeys, CommonProps } from "./interfaces";
import { ParentContext } from "./ParentContext";

export const AppContext = createContext<pxApplication>();
export const useApp = () => useContext(AppContext);

export interface ApplicationProps
  extends Partial<IApplicationOptions>,
    CommonProps<pxApplication> {}

export function Application(props: ApplicationProps) {
  const [ours, pixis] = splitProps(props, CommonPropKeys);

  const app = new pxApplication(pixis);

  createEffect(() => {
    if (props.use) {
      if (Array.isArray(props.use)) {
        props.use.forEach((fn) => fn(app));
      } else {
        props.use(app);
      }
    }
  });

  return (
    <AppContext.Provider value={app}>
      <ParentContext.Provider value={app.stage}>
        {app && ours.children}
      </ParentContext.Provider>
      {app.view as any}
    </AppContext.Provider>
  );
}
