import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'champion',
  pure: false
})

export class ChampionPipe implements PipeTransform {
  transform(items: Array<any>, champion) {
    if (!items || !champion) {
      return items;
    }
    return items.filter((item) => {
      if (!item.requiredChampion) {
        return true;
      }
      return item.requiredChampion === champion;
    });
  }
}
