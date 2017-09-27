import {Item} from '../../../data/item';

export interface ItemBundle {
  item: Item;
  children?: Array<ItemBundle>;
}
