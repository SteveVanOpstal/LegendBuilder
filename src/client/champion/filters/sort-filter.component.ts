import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'lb-sort-filter',
  template: `
    <label>
      <input type="radio" name="type" value="attack"     (change)="sortChanged($event)"/>
      Attack Damage
    </label>
    <label>
      <input type="radio" name="type" value="magic"      (change)="sortChanged($event)"/>
      Ability Power
    </label>
    <label>
      <input type="radio" name="type" value="defense"    (change)="sortChanged($event)"/>
      Defense
    </label>
    <label>
      <input type="radio" name="type" value="difficulty" (change)="sortChanged($event)"/>
      Difficulty
    </label>`
})

export class SortFilterComponent {
  @Input() sort: string = '';
  @Output() sortChange: EventEmitter<string> = new EventEmitter<string>();

  sortChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    let input: any = event.target;
    this.sort = input.value;
    this.sortChange.next(this.sort);
  }
}
