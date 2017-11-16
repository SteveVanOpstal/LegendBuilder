import {Item} from '../../../../models/item';

export interface ItemBundle {
  item: Item;
  children?: Array<ItemBundle>;
}
