import * as d3 from 'd3';

export interface Scale {
  create(): void; // TODO: d3.scale?!
  get(): any;
}
