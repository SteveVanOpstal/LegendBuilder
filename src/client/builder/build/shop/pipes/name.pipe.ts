import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'lbName'})

export class NamePipe implements PipeTransform {
  transform(champions: Array<any>, name) {
    if (!champions || !name || typeof name !== 'string') {
      return champions;
    }

    return champions.filter((champion: any) => {
      return this.clean(champion.name).indexOf(this.clean(name)) >= 0;
    });
  }

  private clean(value: string): string {
    return value.toLowerCase().replace('\'', '');
  }
}
