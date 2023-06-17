import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any): string {
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

    // Define the Ukrainian strings for different time units
    const timeIntervals = {
      year: ['рік', 'роки', 'років'],
      month: ['місяць', 'місяці', 'місяців'],
      week: ['тиждень', 'тижні', 'тижнів'],
      day: ['день', 'дні', 'днів'],
      hour: ['година', 'години', 'годин'],
      minute: ['хвилина', 'хвилини', 'хвилин'],
      second: ['секунда', 'секунди', 'секунд'],
    };

    // Calculate the appropriate time unit
    let intervalType;
    let intervalValue;

    if (seconds < 60) {
      return 'щойно';
    } else if (seconds < 3600) {
      intervalType = 'minute';
      intervalValue = Math.floor(seconds / 60);
    } else if (seconds < 86400) {
      intervalType = 'hour';
      intervalValue = Math.floor(seconds / 3600);
    } else if (seconds < 2592000) {
      intervalType = 'day';
      intervalValue = Math.floor(seconds / 86400);
    } else if (seconds < 31536000) {
      intervalType = 'month';
      intervalValue = Math.floor(seconds / 2592000);
    } else {
      intervalType = 'year';
      intervalValue = Math.floor(seconds / 31536000);
    }

    // Get the correct Ukrainian string based on the time unit and value
    const timeString = this.getTimeString(
      intervalType,
      intervalValue,
      timeIntervals,
    );

    return `${intervalValue} ${timeString} тому`;
  }

  private getTimeString(
    intervalType: string,
    intervalValue: number,
    timeIntervals: any,
  ): string {
    const intervalString = timeIntervals[intervalType];
    if (intervalValue > 9 && intervalValue % 10 !== 0) {
      intervalValue = +intervalValue.toString().slice(-1);
    }
    let timeString = '';

    if (intervalValue === 1) {
      timeString = intervalString[0];
    } else if (intervalValue >= 2 && intervalValue <= 4) {
      timeString = intervalString[1];
    } else {
      timeString = intervalString[2];
    }

    return timeString;
  }
}
