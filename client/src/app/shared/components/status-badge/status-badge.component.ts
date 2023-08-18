import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type StatusBadgeStyle = 'default' | 'accent' | 'success' | 'danger' | 'warn';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
  host: {
    class: 'inline-flex',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  @Input() text!: string;
  @Input() style!: StatusBadgeStyle;
}
