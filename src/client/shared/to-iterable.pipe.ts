import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'lbToIterable'})

export class ToIterablePipe implements PipeTransform {
  transform(values: any): any[] {
    if (!values || typeof values !== 'object') {
      return values;
    }
    let dataArr: Array<any> = [];
    Object.keys(values).forEach(key => {
      dataArr.push(values[key]);
    });
    return dataArr;
  }
}
