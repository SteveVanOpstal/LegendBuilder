import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {settings} from '../../../../../config/settings';
import {Samples} from '../../../models/samples';
import {Item} from '../../../models/item';
import {BuildSandbox} from '../build.sandbox';
import {TimeScale} from '../graph/scales';

@Injectable()
export class PickedItemsService {
  private xScaleTime = new TimeScale([0, 1420]);

  allItems: Item[];

  constructor(private sb: BuildSandbox) {
    Observable
        .combineLatest(
            this.sb.pickedItems$, this.sb.items$, this.sb.matchdata$,
            (pickedItems, allItems, samples) => {
              if (pickedItems && allItems && allItems.length && samples && samples.xp) {
                this.allItems = allItems;
                return this.update(pickedItems, samples);
              }
            })
        .subscribe((items) => {
          sb.setPickedItems(items);
        });
  }

  private update(pickedItems: Array<Item>, samples: Samples): Array<Item> {
    let result = pickedItems;
    result = this.updateBundles(result);
    result = this.updateDiscounts(result);
    result = this.updateTimes(result, samples);
    result = this.updateOffsets(result);
    return result;
  }

  private updateBundles(items: Array<Item>): Array<Item> {
    for (const item of items) {
      if (!item.bundle) {
        item.bundle = 1;
      }
    }

    for (let index = 0; index < items.length - 1; index++) {
      const itemCurrent = items[index];
      const itemNext = items[index + 1];
      if (itemCurrent.id === itemNext.id && itemCurrent.bundle < itemCurrent.stacks) {
        itemCurrent.bundle++;
        items.splice(index + 1, 1);
        index--;
      }
    }
    return items;
  }

  private updateDiscounts(items: Array<Item>): Array<Item> {
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const item = items[itemIndex];
      item.discount = 0;
      item.contains = [];
      item.contained = false;
      for (let searchItemIndex = 0; searchItemIndex < itemIndex; searchItemIndex++) {
        const searchItem = items[searchItemIndex];
        if (!item.from || !searchItem || searchItem.contained) {
          continue;
        }
        const itemFromIds = this.getItemsFrom(item).filter((itemFrom: number) => {
          return itemFrom.toString() === searchItem.id.toString();
        });
        const itemContainsIds = item.contains.filter((itemContains) => {
          return itemContains.id === searchItem.id;
        });
        if (itemFromIds.length > itemContainsIds.length) {
          item.discount += searchItem.gold.total;
          searchItem.contained = true;
          item.contains.push(searchItem);
        }
      }
    }
    return items;
  }

  private updateTimes(items: Array<Item>, samples: Samples): Array<Item> {
    if (!samples) {
      return items;
    }
    let goldOffset = 0;
    for (const item of items) {
      const itemGold = (item.gold.total * item.bundle) - item.discount;
      item.time = this.getTime(
          samples.gold, goldOffset + itemGold, settings.match.gameTime, settings.match.sampleSize);
      goldOffset += itemGold;
    }
    return items;
  }

  private updateOffsets(items: Array<Item>): Array<Item> {
    for (const item of items) {
      item.offset = this.xScaleTime.get()(item.time);
    }
    return items;
  }

  private getItemsFrom(baseItem: Item): Array<number> {
    if (!baseItem.from || !baseItem.from.length) {
      return [];
    }
    const items: Array<Item> = baseItem.from.map((id: string) => {
      return this.getItem(id);
    });
    let arr = Array<number>();
    for (const item of items) {
      arr = arr.concat(item.id, this.getItemsFrom(item));
    }
    return arr;
  }

  private getItem(id: string): Item {
    return this.allItems.find((item) => item.id.toString() === id);
  }

  private getTime(frames: Array<number>, value: number, totalTime: number, sampleSize: number):
      number {
    const index = this.getUpperIndex(frames, value);
    if (index <= -1) {
      return -1;
    }

    const lowerFrame = frames[index];
    const upperFrame = frames[index + 1];

    const ratio = (value - lowerFrame) / (upperFrame - lowerFrame);

    const sampleTime = totalTime / sampleSize;
    const lowerTime = index * sampleTime;
    const upperTime = (index + 1) * sampleTime;

    let time = lowerTime + ((upperTime - lowerTime) * ratio);
    time = isFinite(time) ? time : lowerTime;
    return time > 0 ? time : 0;
  }

  private getUpperIndex(frames: Array<number>, gold: number): number {
    for (let j = 0; j < frames.length; j++) {
      if (frames[j] > gold) {
        return j;
      }
    }
    return -1;
  }
}
