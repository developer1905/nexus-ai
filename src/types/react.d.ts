declare module 'react' {
  export = React;
}

declare namespace React {
  export type ReactNode = any;
  export type ReactElement = any;
  export type FC<P = {}> = (props: P) => any;
  export type FormEvent<T = Element> = any;
  export type ChangeEvent<T = Element> = any;
  export type MouseEvent<T = Element> = any;
  export type KeyboardEvent<T = Element> = any;
  export type CSSProperties = Record<string, any>;
  export const Fragment: any;
  export function useState<T>(initial: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initial?: T): { current: T };
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export interface Context<T> { Provider: any; Consumer: any; }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
}

declare module 'react-dom/client' {
  export function createRoot(container: any): {
    render(children: any): void;
    unmount(): void;
  };
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface Element extends React.ReactElement {}
  }
}
