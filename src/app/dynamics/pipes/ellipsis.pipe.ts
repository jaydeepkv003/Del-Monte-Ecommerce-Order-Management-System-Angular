import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(val: string, args: number): string {
    return val && args !== undefined && val.length > args
      ? `${val.substring(0, args)} ...`
      : val;
  }
}
