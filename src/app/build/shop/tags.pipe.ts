import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'tags',
  pure: false
})

export class TagsPipe implements PipeTransform {
  transform(items: Array<any>, [tags]) {
    if (!items || !tags) {
      return items;
    }
    return items.filter((item) => {
      if (!item['tags']) {
        return false;
      }
      if (tags && tags.length > 0) {
        for (var tag in tags) {
          item['tags'] = item['tags'].map(tag => tag.toLowerCase());
          if (item['tags'].indexOf(tags[tag].toLowerCase()) === -1) {
            return false;
          }
        }
      }
      return true;
    });
  }
}
