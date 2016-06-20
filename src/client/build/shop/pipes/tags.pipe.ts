import {Pipe, PipeTransform} from '@angular/core';
import {Item} from '../../item';

@Pipe({name: 'tags', pure: false})

export class TagsPipe implements PipeTransform {
  transform(items: Array<any>, tags) {
    if (!items || !tags) {
      return items;
    }
    return items.filter((item: Item) => {
      if (!item.tags) {
        return false;
      }
      if (tags) {
        for (let index = 0; index < tags.length; index++) {
          item.tags = item.tags.map(tag => tag.toLowerCase());
          if (item.tags.indexOf(tags[index].toLowerCase()) === -1) {
            return false;
          }
        }
      }
      return true;
    });
  }
}
