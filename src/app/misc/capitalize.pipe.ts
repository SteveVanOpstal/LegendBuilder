import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'capitalize'
})

export class CapitalizePipe implements PipeTransform {
  transform(value: string) {
    value = value.toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
