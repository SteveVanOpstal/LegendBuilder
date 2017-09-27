import {Item} from '../data/item';

export interface AppState { items: Array<Item>; }

export const initialState: AppState = {
  items: []
};
