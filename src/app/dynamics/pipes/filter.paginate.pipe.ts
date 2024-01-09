import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterPaginate' })
export class FilterPaginatePipe implements PipeTransform {
  transform(value: any, args: FilterPaginateVal): any[] {
    let returnData = [];

    if (value && value instanceof Array && value.length && args.filter) {
      const filterObj = args.filter.toLowerCase();
      value.forEach((item) => {
        let isAdded = false;
        Object.keys(item).forEach((key) => {
          if (
            !isAdded &&
            item[key] &&
            item[key].toString().toLowerCase().indexOf(filterObj) > -1
          ) {
            returnData.push(item);
            isAdded = true;
          }
        });
      });
    } else {
      returnData = value;
    }
    args.filterCount.count = returnData.length;

    if (value && value instanceof Array && args.itemsPerPage) {
      if (args.filterCount.count > args.itemsPerPage) {
        const pageOffset =
          (args.currentPage !== 0 ? args.currentPage - 1 : 0) *
          args.itemsPerPage;

        returnData = returnData.slice(
          pageOffset,
          pageOffset + args.itemsPerPage
        );
      }
    }
    return returnData;
  }
}

export interface FilterPaginateVal {
  filter: string;
  itemsPerPage: number;
  currentPage: number;
  filterCount: { count: number };
}
