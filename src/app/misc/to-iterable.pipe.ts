import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'toIterable'
})

export class ToIterablePipe implements PipeTransform {
  transform(values: any): any[] {
    if (!values) {
      return values;
    }
    var dataArr = [];
    Object.keys(values).forEach(key => {
      dataArr.push(values[key]);
    });
    return dataArr;
  }
}
