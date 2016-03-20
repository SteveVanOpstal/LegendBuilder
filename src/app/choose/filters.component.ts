import {Pipe, PipeTransform, Component, Input} from 'angular2/core';
import {NgModel} from 'angular2/common';


@Pipe({
  name: 'filter', // :[name]:[sort]:[tags]
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(champions: Array<Object>, args: any[]) {
    return champions ? champions.filter((champion) => {
      // name
      if (args[0] && this.clean(champion['name']).indexOf(this.clean(args[0])) === -1) {
        return false;
      }

      // sort

      // tags
      if (!args[2] || args[2].length <= 0) {
        return true;
      }
      champion['tags'] = this.exclude(champion['tags'], "Melee");
      var result = true;
      for (var tag in args[2]) {
        if (champion['tags'].indexOf(args[2][tag]) === -1) {
          result = false;
        }
      }
      return result;
    }) : champions;
  }

  private clean(value: string): string {
    return value.toLowerCase().replace('\'', '');
  }

  private exclude(array: Array<string>, exclude: string) {
    var index: number = array.indexOf(exclude);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }
}

@Component({
  selector: 'filters',
  directives: [NgModel],
  template: `
    <div class="left">
      <div class="align-center">
        <label><input type="checkbox" name="Marksman" (change)="tagChanged($event)"/>Marksman</label>
        <label><input type="checkbox" name="Assassin" (change)="tagChanged($event)"/>Assassin</label>
        <label><input type="checkbox" name="Fighter"  (change)="tagChanged($event)"/>Fighter</label>
        <label><input type="checkbox" name="Mage"     (change)="tagChanged($event)"/>Mage</label>
        <label><input type="checkbox" name="Tank"     (change)="tagChanged($event)"/>Tank</label>
        <label><input type="checkbox" name="Support"  (change)="tagChanged($event)"/>Support</label>
      </div>
    </div>
    <div class="center align-center">
      <div>
        <h2>Choose your weapon</h2>
        <input type="text" name="name" placeholder="Name" [(ngModel)]="name"/>
        <div class="align-center melee-ranged">
          
        </div>
      </div>
    </div>
    <div class="right">
      <div class="align-center">

      </div>
    </div>`
})

export class FiltersComponent {
  @Input() tags: Array<string> = [];
  @Input() sort: Object = Object();

  private tagChanged(event) {
    if (!event || !event.target) {
      return;
    }
    var input = event.target;
    if (input.checked) {
      this.tags.push(input.name);
    } else {
      var index: number = this.tags.indexOf(input.name);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    }
  }
}
