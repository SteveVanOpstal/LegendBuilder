import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'lb-sort-filter',
  styleUrls: ['./sort-filter.component.scss'],
  template: `
    <div class="align-center">
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
      </label>
    </div>`
})

export class SortFilterComponent {
  @Input() sort = '';
  @Output() sortChange: EventEmitter<string> = new EventEmitter<string>();

  sortChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    const input: any = event.target;
    this.sort = input.value;
    this.sortChange.next(this.sort);
  }
}
