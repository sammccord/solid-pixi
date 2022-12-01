import { Container } from "pixi.js";
import { createContext, useContext } from "solid-js";

export const ParentContext = createContext<Container>();
export const useParent = () => useContext(ParentContext);
