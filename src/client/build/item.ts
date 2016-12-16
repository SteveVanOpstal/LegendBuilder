export interface Item {
  id: string;
  from?: Array<string>;
  into?: Array<string>;
  gold: {total: number};
  image?: {full: string};
  tags?: Array<string>;
  stats?: any;
  description?: string;
  stacks?: number;
  consumed?: boolean;

  time?: number;
  bundle?: number;
}
