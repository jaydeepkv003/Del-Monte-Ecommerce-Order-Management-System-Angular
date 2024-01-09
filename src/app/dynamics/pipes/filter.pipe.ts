import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(value: any, args: string): any[] {
    const returnData = [];
    if (value && value instanceof Array && value.length && args) {
      args = args.toLowerCase();
      value.forEach((item) => {
        let isAdded = false;
        Object.keys(item).forEach((key) => {
          if (
            !isAdded &&
            item[key] &&
            item[key].toString().toLowerCase().indexOf(args) > -1
          ) {
            returnData.push(item);
            isAdded = true;
          }
        });
      });
    } else {
      return value;
    }
    return returnData;
  }
}
