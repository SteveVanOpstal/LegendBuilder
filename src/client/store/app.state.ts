import {Item} from '../models/item';

export interface AppState { items: Array<Item>; }

export const initialState: AppState = {
  items: []
};
