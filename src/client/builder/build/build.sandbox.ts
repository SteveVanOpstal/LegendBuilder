import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {Item} from '../../models/item';

import {LolApiService} from '../../services/lolapi.service';
import {AppState} from '../../store/app.state';
import {AddItem, MoveItem, RemoveItem, SetItems} from '../../store/items/items.actions';

@Injectable()
export class BuildSandbox {
  champion$ = this.lolApi.getCurrentChampion();
  championId$ = this.lolApi.getCurrentChampion().map(res => res.id);
  championName$ = this.lolApi.getCurrentChampion().map(res => res.name);
  matchdata$ = this.lolApi.getCurrentMatchData();
  items$ = this.lolApi.getItems().map(res => res.data).map(res => this.toArray(res)).startWith([]);
  itemsTree$ =
      this.lolApi.getItems().map(res => res.tree).map(res => this.toArray(res)).startWith([]);
  pickedItems$ = this.store.select(state => state.items).startWith(undefined);
  masteries$ = this.lolApi.getMasteries().map(res => this.transformMasteries(res));

  constructor(private lolApi: LolApiService, private store: Store<AppState>) {}

  setPickedItems(items: Item[]) {
    this.store.dispatch(new SetItems(items));
  }

  addPickedItem(item: Item) {
    this.store.dispatch(new AddItem(item));
  }

  removePickedItem(item: Item) {
    this.store.dispatch(new RemoveItem(item));
  }

  movePickedItem(source: Item, target: Item) {
    this.store.dispatch(new MoveItem(source, target));
  }

  private toArray(arr: Object): Array<any> {
    return Object.keys(arr).map((value) => arr[value]);
  }

  private transformMasteries(newMasteries: any) {
    const transformedMasteries: Array<any> = [];

    for (const categoryName of Object.keys(newMasteries.tree)) {
      const category = newMasteries.tree[categoryName];
      const tiers: Array<any> = [];
      for (const masteryTreeItemName of Object.keys(category)) {
        const masteryTreeItem = category[masteryTreeItemName];
        const item: Array<any> = [];
        for (const masteryName of Object.keys(masteryTreeItem.masteryTreeItems)) {
          const mastery = masteryTreeItem.masteryTreeItems[masteryName];
          if (mastery !== null) {
            item.push(newMasteries.data[mastery.masteryId]);
          } else {
            item.push(null);
          }
        }
        tiers.push(item);
      }
      transformedMasteries.push({name: categoryName, tiers: tiers});
    }

    return transformedMasteries;
  }
}
