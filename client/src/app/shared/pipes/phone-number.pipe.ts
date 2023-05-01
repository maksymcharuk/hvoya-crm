import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber',
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }

    // Remove all non-digit characters from the input value
    const phoneNumber = value.replace(/\D/g, '');

    // Check if the phone number has a valid length
    if (phoneNumber.length !== 10) {
      return value; // Return the original value if it doesn't have the expected length
    }

    // Format the phone number as +38 (XXX) XXX-XXXX
    const formattedNumber = `+38 (${phoneNumber.slice(
      0,
      3,
    )}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;

    return formattedNumber;
  }
}
