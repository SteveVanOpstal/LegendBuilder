declare let ENV: string;
interface GlobalEnvironment {
  ENV;
}

interface ErrorStackTraceLimit {
  stackTraceLimit: number;
}

// Extend jasmine matchers
declare namespace jasmine {
  interface Matchers<T> {
    toHaveEqualContent(expected: any): boolean;
  }
}

// Extend typings
interface ErrorConstructor extends ErrorStackTraceLimit {}
