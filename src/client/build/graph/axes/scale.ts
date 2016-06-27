import * as d3 from 'd3';

export interface Scale {
  create(): void;
  get(): any;
}
