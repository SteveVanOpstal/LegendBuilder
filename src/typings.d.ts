/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// Extend jasmine matchers
declare module jasmine {
  interface Matchers<T> {
    toHaveEqualContent(expected: any): boolean;
  }
}
