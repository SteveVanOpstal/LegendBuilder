import * as d3 from 'd3-scale';

export interface Scale {
  scale: d3.ScaleLinear<number, number>;
  create(): void;
  get(): any;
}
