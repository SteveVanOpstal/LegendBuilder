export declare module settings {
  var httpServer: { host: string, port: number };
  var staticServer: { host: string, port: number };
  var matchServer: { host: string, port: number };
  var apiVersions: {
    summoner: string,
    matchlist: string,
    match: string,
    'static-data': string,
  }
}
