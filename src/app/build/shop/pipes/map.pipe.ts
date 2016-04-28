import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'map',
  pure: false
})

export class MapPipe implements PipeTransform {
  transform(items: Array<any>, map) {
    if (!items || !map) {
      return items;
    }
    return items.filter((item) => {
      if (!item.maps || item.maps.length <= 0) {
        return false;
      }
      return item.maps[map];
    });
  }
}
