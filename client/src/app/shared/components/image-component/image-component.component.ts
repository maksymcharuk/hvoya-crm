import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.scss'],
})
export class ImageComponentComponent implements OnChanges {
  @Input() loader: string =
    'https://media.tenor.com/images/f864cbf3ea7916572605edd3b3fe637f/tenor.gif';
  @Input() height: string = '100%';
  @Input() width: string = '100%';
  @Input() image!: string;

  isLoading: boolean;

  constructor() {
    this.isLoading = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['image']) {
      this.isLoading = true;
    }
  }

  hideLoader() {
    this.isLoading = false;
  }
}
