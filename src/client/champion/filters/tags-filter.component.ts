import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'lb-tags-filter',
  template: `
    <label>
      <input type="checkbox" value="Marksman" (change)="tagChanged($event)"/>
      Marksman
    </label>
    <label>
      <input type="checkbox" value="Assassin" (change)="tagChanged($event)"/>
      Assassin
    </label>
    <label>
      <input type="checkbox" value="Fighter"  (change)="tagChanged($event)"/>
      Fighter
    </label>
    <label>
      <input type="checkbox" value="Mage"     (change)="tagChanged($event)"/>
      Mage
    </label>
    <label>
      <input type="checkbox" value="Tank"     (change)="tagChanged($event)"/>
      Tank
    </label>
    <label>
      <input type="checkbox" value="Support"  (change)="tagChanged($event)"/>
      Support
    </label>`
})

export class TagsFilterComponent {
  @Input() tags: Array<string> = [];
  @Output() tagsChange: EventEmitter<Array<string>> = new EventEmitter<Array<string>>();

  tagChanged(event: Event) {
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
}
