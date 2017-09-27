import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'lb-filters',
  styleUrls: ['./filters.component.scss'],
  template: `
    <lb-tags-filter [(tags)]="tags"></lb-tags-filter>
    <div class="center align-center">
      <label>
        <h2 id="sub-title">Pick your champion</h2>
        <input type="text"
               name="name"
               placeholder="Name"
               aria-labelledby="sub-title"
               (keyup.enter)="enterHit.next()"
               (input)="nameChange.next($event.target.value)" autofocus/>
      </label>
    </div>
    <lb-sort-filter [sort]="sort" (sortChange)="sortChange.next($event)"></lb-sort-filter>`
})

export class FiltersComponent {
  @Input() tags: Array<string> = [];
  @Input() name: string;
  @Output() nameChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() sort: string;
  @Output() sortChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() enterHit: EventEmitter<any> = new EventEmitter<any>();
}
