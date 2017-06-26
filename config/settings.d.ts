export declare module settings {
  let host: string
  let port: number;
  let domain: string;
  let static: {port: number};
  let match: {port: number, sampleSize: number};
  let sampleSize: number;
  let api: {
    regions: Array<string>,
    versions: {
      summoner: string,
      match: string,
      'static-data': string,
    }
  };
  let gameTime: number;
}
