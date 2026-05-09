import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'countByStatus',
 standalone: true
})
export class CountByStatusPipe implements PipeTransform {
 transform(items: any[], status: string): number {
 if (!items) return 0;
 return items.filter(item =>item.status === status).length;
 }
}

