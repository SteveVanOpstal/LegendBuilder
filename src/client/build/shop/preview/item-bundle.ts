import {Item} from '../../item';

export interface ItemBundle {
  item: Item;
  children?: Array<ItemBundle>;
}
