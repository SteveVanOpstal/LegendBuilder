export declare module settings {
  let host: string
  let port: number;
  let domain: string;
  let static: {port: number};
  let match: {port: number, sampleSize: number};
  let sampleSize: number;
  let apiVersions: {
    summoner: string,
    matchlist: string,
    match: string,
    'static-data': string,
  };
  let gameTime: number;
}
