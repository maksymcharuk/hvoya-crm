import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.scss'],
})
export class ImageComponentComponent implements OnChanges {
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
