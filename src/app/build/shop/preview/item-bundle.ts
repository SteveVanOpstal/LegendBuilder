import {Item} from '../../../misc/item';

export interface ItemBundle {
  item: Item;
  children?: Array<ItemBundle>;
}
