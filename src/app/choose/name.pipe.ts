import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'name'
})

export class NamePipe implements PipeTransform {
  transform(champions: Array<Object>, [name]) {
    if (!champions || !name || typeof name !== 'string') {
      return champions;
    }

    return champions.filter((champion) => {
      return this.clean(champion['name']).indexOf(this.clean(name)) === 0;
    });
  }

  private clean(value: string): string {
    return value.toLowerCase().replace('\'', '');
  }
}
