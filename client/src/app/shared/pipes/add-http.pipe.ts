import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addHttp',
})
export class AddHttpPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value; // Return empty string if the input is falsy
    }

    // Check if the URL starts with 'http://' or 'https://', and add 'http://' if not.
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return 'http://' + value;
    }

    return value; // If the URL already starts with 'http://' or 'https://', return it as is.
  }
}
