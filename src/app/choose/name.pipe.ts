import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'name',
  pure: false
})

export class NamePipe implements PipeTransform {
  private prevName: string;

  transform(champions: Array<Object>, [name]) {
    if (!champions || !name || typeof name !== 'string' || this.prevName === name) {
      return champions;
    }

    this.prevName = name;

    return champions.filter((champion) => {
      return this.clean(champion['name']).indexOf(this.clean(name)) > -1;
    });
  }

  private clean(value: string): string {
    return value.toLowerCase().replace('\'', '');
  }
}
