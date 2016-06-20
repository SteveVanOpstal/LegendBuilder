import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'tags', pure: false})

export class TagsPipe implements PipeTransform {
  transform(champions: Array<any>, tags) {
    if (!champions || !tags) {
      return champions;
    }

    return champions.filter((champion: any) => {
      if (tags && tags.length > 0) {
        champion.tags = this.exclude(champion.tags, 'Melee');
        for (let tag in tags) {
          if (champion.tags.indexOf(tags[tag]) === -1) {
            return false;
          }
        }
      }
      return true;
    });
  }

  private exclude(array: Array<string>, exclude: string) {
    let index: number = array.indexOf(exclude);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  }
}
