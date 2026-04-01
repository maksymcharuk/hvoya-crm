import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-stock-badge',
  templateUrl: './stock-badge.component.html',
  styleUrls: ['./stock-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockBadgeComponent {
  @Input() value!: number;
  @Input() highlight = false;
}
