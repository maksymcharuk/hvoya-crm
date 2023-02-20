import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-state-changes',
  templateUrl: './product-state-changes.component.html',
  styleUrls: ['./product-state-changes.component.scss']
})
export class ProductStateChangesComponent {
  @Input() change: any;
}
