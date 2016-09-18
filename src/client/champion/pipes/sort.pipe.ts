import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'sort', pure: false})

export class SortPipe implements PipeTransform {
  private prevSort: string;

  transform(champions: Array<Object>, sort) {
    if (!champions || this.prevSort === sort) {
      return champions;
    }

    this.prevSort = sort;

    if (sort && typeof sort === 'string' && sort.length > 0) {
      // sort by info
      champions.sort((a: any, b: any) => {
        if (a.info[sort] === b.info[sort]) {
          return 0;
        }
        if (a.info[sort] < b.info[sort]) {
          return 1;
        }
        return -1;
      });
    } else {
      // sort alphabetical
      champions.sort((a: any, b: any) => {
        return a.name < b.name ? -1 : 1;
      });
    }

    return champions;
  }
}
