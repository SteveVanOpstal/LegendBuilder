import {Action} from '@ngrx/store';

import {Item} from '../../data/item';
import {type} from '../../store/util';

export const ActionTypes = {
  ADD_ITEM: type<'ADD_ITEM'>('ADD_ITEM'),
  REMOVE_ITEM: type<'REMOVE_ITEM'>('REMOVE_ITEM'),
  MOVE_ITEM: type<'MOVE_ITEM'>('MOVE_ITEM')
};

class ItemAction {
  payload: Item;

  constructor(data: Item) {
    this.payload = data;
  }
}

export class AddItem extends ItemAction implements Action { type = ActionTypes.ADD_ITEM; }

export class RemoveItem extends ItemAction implements Action { type = ActionTypes.REMOVE_ITEM; }

export class MoveItem implements Action {
  type = ActionTypes.MOVE_ITEM;
  payload: {source: Item, target: Item};

  constructor(source: Item, target: Item) {
    this.payload = {source: source, target: target};
  }
}

export type Actions = AddItem|RemoveItem|MoveItem;
