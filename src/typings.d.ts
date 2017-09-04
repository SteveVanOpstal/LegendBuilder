/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// declare module '*.svg' {
//   const value: string;
//   export default value;
// }

// Extend jasmine matchers
declare module jasmine {
  interface Matchers<T> {
    toHaveEqualContent(expected: any): boolean;
  }
}
