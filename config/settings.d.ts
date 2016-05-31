export declare module settings {
  let httpServer: { host: string, port: number };
  let staticServer: { host: string, port: number };
  let matchServer: { host: string, port: number };
  let apiVersions: {
    summoner: string,
    matchlist: string,
    match: string,
    'static-data': string,
  }
  let gameTime: number;
  let sampleSize: number;
}
