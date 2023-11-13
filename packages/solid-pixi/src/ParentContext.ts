import { Container } from 'pixi.js'
import { createContext, useContext } from 'solid-js'

export const ParentContext = createContext<Container>()
export function useParent<T = Container>() {
  return useContext(ParentContext) as T
}
