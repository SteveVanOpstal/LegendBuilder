import {NgModel} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'filters',
  directives: [NgModel],
  template: `
    <div class="left">
      <div class="align-center">
        <label><input type="checkbox" value="Marksman" (change)="tagChanged($event)"/>Marksman</label>
        <label><input type="checkbox" value="Assassin" (change)="tagChanged($event)"/>Assassin</label>
        <label><input type="checkbox" value="Fighter"  (change)="tagChanged($event)"/>Fighter</label>
        <label><input type="checkbox" value="Mage"     (change)="tagChanged($event)"/>Mage</label>
        <label><input type="checkbox" value="Tank"     (change)="tagChanged($event)"/>Tank</label>
        <label><input type="checkbox" value="Support"  (change)="tagChanged($event)"/>Support</label>
      </div>
    </div>
    <div class="center align-center">
      <div>
        <h2>Pick your champion</h2>
        <input type="text" name="name" placeholder="Name" (keyup.enter)="enterHit.next(undefined)" (input)="nameChange.next($event.target.value)" autofocus/>
      </div>
    </div>
    <div class="right">
      <div class="align-center">
        <label><input type="radio" name="type" value="attack"     (change)="sortChanged($event)"/>Attack Damage</label>
        <label><input type="radio" name="type" value="magic"      (change)="sortChanged($event)"/>Ability Power</label>
        <label><input type="radio" name="type" value="defense"    (change)="sortChanged($event)"/>Defense</label>
        <label><input type="radio" name="type" value="difficulty" (change)="sortChanged($event)"/>Difficulty</label>
      </div>
    </div>`
})

export class FiltersComponent {
  @Input() name: string;
  @Output() nameChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() tags: Array<string> = [];
  @Output() tagsChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() sort: string;
  @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() enterHit: EventEmitter<any> = new EventEmitter<any>();

  private tagChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    let input: any = event.target;
    if (input.checked) {
      this.tags.push(input.value);
    } else {
      let index: number = this.tags.indexOf(input.value);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
    this.tagsChange.next(this.tags);
  }

  private sortChanged(event: Event) {
    if (!event || !event.target) {
      return;
    }
    let input: any = event.target;
    this.sort = input.value;
    this.sortChange.next(this.sort);
  }
}
