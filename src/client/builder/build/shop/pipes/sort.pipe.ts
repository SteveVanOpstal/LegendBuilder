import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'lbSort'})

export class SortPipe implements PipeTransform {
  transform(items: Array<any>) {
    return items.sort((a: any, b: any) => {
      return a.gold.total > b.gold.total ? 1 : -1;
    });
  }
}
