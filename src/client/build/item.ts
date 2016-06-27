export interface Item {
  id: number;
  time: number;
  from: Array<string>;
  into: Array<string>;
  bundle: number;
  gold: {total: number};
  image: {full: string};
  tags: Array<string>;
  stats: any;
}
