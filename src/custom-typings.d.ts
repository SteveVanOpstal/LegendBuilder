declare let ENV: string;
interface GlobalEnvironment {
  ENV;
}

interface WebpackModule {
  hot: {
    data?: any,
    idle: any, accept(dependencies?: string|string[], callback?: (updatedDependencies?: any) => void): void;
    decline(dependencies?: string | string[]): void;
    dispose(callback?: (data?: any) => void): void;
    addDisposeHandler(callback?: (data?: any) => void): void;
    removeDisposeHandler(callback?: (data?: any) => void): void;
    check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    status(callback?: (status?: string) => void): void | string;
    removeStatusHandler(callback?: (status?: string) => void): void;
  };
}
interface WebpackRequire extends NodeRequireFunction {
  context(file: string, flag?: boolean, exp?: RegExp): any;
}


interface ErrorStackTraceLimit {
  stackTraceLimit: number;
}


// Extend jasmine matchers
declare namespace jasmine {
  interface Matchers {
    toHaveEqualContent(expected: any): boolean;
  }
}

// Extend typings
interface NodeRequire extends WebpackRequire {}
interface ErrorConstructor extends ErrorStackTraceLimit {}
interface NodeModule extends WebpackModule {}
interface Global extends GlobalEnvironment {}
