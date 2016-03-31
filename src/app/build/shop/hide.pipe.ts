import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'hide',
  pure: false
})

export class HidePipe implements PipeTransform {
  transform(items: Array<any>) {
    if (!items) {
      return items;
    }
    return items.filter((item) => {
      return !item.hideFromAll;
    });
  }
}
