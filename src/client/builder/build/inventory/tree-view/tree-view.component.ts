import {Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {Item} from '../../../../models/item';
import {ReactiveComponent} from '../../../../shared/reactive.component';
import {BuildSandbox} from '../../build.sandbox';

import {ItemSlotComponent} from './item-slot/item-slot.component';

@Component({
  selector: 'lb-tree-view',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1500 300">
      <g transform="translate(60,0)">
        <ng-template ngFor let-item [ngForOf]="sb.pickedItems$ | async">
          <ng-template [ngIf]="!item.contained">
            <g lbItemCurve [item]="item"></g>
          </ng-template>
        </ng-template>
        <ng-template ngFor [ngForOf]="[0,1,2,3,4,5]" let-i="index">
          <g lbItemSlot [attr.transform]="'translate(0,' + (i * 50) + ')'"
                        [ngClass]="{dragging: dragging}"
                        (itemSelected)="itemSelected.emit($event)"
                        (itemRemoved)="sb.removePickedItem($event)"
                        (itemDragStart)="itemDragStart($event)"
                        (itemDragEnd)="itemDragEnd()"
                        (itemDrop)="itemDrop($event)">
          </g>
        </ng-template>
      </g>
    </svg>`
})

export class TreeViewComponent extends ReactiveComponent implements OnInit {
  @Output() itemSelected: EventEmitter<Item> = new EventEmitter<Item>();
  @ViewChildren(ItemSlotComponent) children: QueryList<ItemSlotComponent>;

  dragging = false;
  dragged: Item;

  allItems: Item[];
  pickedItems: Item[];

  constructor(public sb: BuildSandbox) {
    super();
  }

  ngOnInit() {
    Observable
        .combineLatest(
            this.sb.items$, this.sb.pickedItems$, this.sb.matchdata$,
            (items, pickedItems, samples) => {
              if (items && items.length && pickedItems && samples && samples.xp) {
                this.allItems = items;
                this.pickedItems = pickedItems;
                this.update();
              }
            })
        .takeUntil(this.takeUntilDestroyed$)
        .subscribe((pickedItems) => pickedItems);
  }

  itemDragStart(item: Item) {
    this.dragged = item;
    this.dragging = true;
  }

  itemDragEnd() {
    this.dragging = false;
  }

  itemDrop(item: Item) {
    this.dragging = false;
    this.sb.movePickedItem(this.dragged, item);
  }

  private update() {
    if (this.pickedItems) {
      this.updateSlots(this.pickedItems);
    }
    // this.updateOriginalItems(items);
  }

  // private updateOriginalItems(items: Array<Item>): void {
  //   if (!items) {
  //     return;
  //   }
  //   for (const index of Object.keys(items)) {
  //     const i = parseInt(index, 10);
  //     for (let index2 = 0; index2 < items[i].bundle; index2 += 1) {
  //       this.items[i + index2].time = items[i].time;
  //     }
  //   }
  // }

  private updateSlots(pickedItems: Array<Item>): void {
    if (!this.children) {
      return;
    }
    this.children.forEach((slot: ItemSlotComponent) => {
      slot.items = [];
    });
    for (const item of pickedItems) {
      const slot = this.findSlot(item);
      if (slot) {
        slot.items.push(item);
      } else {
        console.log('unable to find slot');
        this.sb.removePickedItem(item);
      }
    }
  }

  private findSlot(item: Item): ItemSlotComponent|undefined {
    return this.children.toArray().find((slot: ItemSlotComponent, index: number) => {
      if (this.slotAvailable(slot) || this.slotCompatible(slot, item)) {
        item.slotId = index;
        return true;
      }
      return false;
    });
  }

  private slotAvailable(slot: ItemSlotComponent): boolean {
    const lastItem = slot.lastItem();
    if (!lastItem) {
      return true;
    }
    if (!lastItem.contained) {
      return false;
    }
    const childSlot = this.children.toArray().find((child: ItemSlotComponent) => {
      return this.contains(child.lastItem(), lastItem);
    });
    return childSlot !== undefined;
  }

  private slotCompatible(slot: ItemSlotComponent, subject: Item): boolean {
    const lastItem = slot.lastItem();
    if (!lastItem) {
      return false;
    }

    return this.compatibleWithItem(subject, lastItem) ||
        this.compatibleWithConsumableItem(subject, lastItem);
  }

  private contains(container: Item, item: Item): boolean {
    if (!container || !container.contains.length) {
      return false;
    }
    return container.contains.find((containedItem: Item) => {
      if (containedItem === item) {
        return true;
      } else if (containedItem.contains.length) {
        if (this.contains(containedItem, item)) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    }) !== undefined;
  }

  private compatibleWithItem(subject1: Item, subject2: Item): boolean {
    return this.buildsFrom(subject1, subject2);
  }

  private compatibleWithConsumableItem(subject: Item, subject2: Item): boolean {
    if (subject2.time !== subject.time) {
      return subject2.consumed;
    } else {
      return subject2.consumed && subject2.id === subject.id && subject2.bundle < subject2.stacks;
    }
  }

  private buildsFrom(subject: Item, item: Item): boolean {
    if (!subject.from || !subject.from.length || !item) {
      return false;
    }

    for (const id of subject.from) {
      if (this.buildsFrom(this.getItem(this.allItems, id), item)) {
        return true;
      }
    }

    return subject.from.indexOf(item.id.toString()) > -1;
  }

  private getItem(items: Array<Item>, id: string): Item {
    return items.find((item) => item.id.toString() === id);
  }
}
