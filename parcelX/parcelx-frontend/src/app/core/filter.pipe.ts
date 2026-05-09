import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'filter',
 standalone: true
})
export class FilterPipe implements PipeTransform {
 transform(items: any[], searchTerm: string): any[] {
 if (!items || !searchTerm) {
 return items;
 }
 return items.filter(item =>JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
 );
 }
}

