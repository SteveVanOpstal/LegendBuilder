import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'lbCapitalize'})

export class CapitalizePipe implements PipeTransform {
  transform(value: string) {
    value = value.toLowerCase();
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
