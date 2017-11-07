import {Component, EventEmitter, Output} from '@angular/core';
import {Item} from '../../../data/item';

export enum ViewType {
  tree,
  list
}

@Component({
  selector: 'lb-inventory',
  styleUrls: ['inventory.component.scss'],
  template: `
    <!--<button type="button" class="tree view" (click)="toggle()">
      <lb-icon-tree *ngIf="viewType === ViewType.list"></lb-icon-tree>
      <lb-icon-list *ngIf="viewType === ViewType.tree"></lb-icon-list>
    </button>

    <lb-list-view *ngIf="viewType === ViewType.list" (itemSelected)="itemSelected.next($event)"></lb-list-view>-->
    <lb-tree-view *ngIf="viewType === ViewType.tree" (itemSelected)="itemSelected.next($event)"></lb-tree-view>`
})
export class InventoryComponent {
  @Output() itemSelected = new EventEmitter<Item>();

  ViewType = ViewType;
  viewType = ViewType.tree;

  toggle() {
    this.viewType = this.viewType === ViewType.list ? ViewType.tree : ViewType.list;
  }
}
