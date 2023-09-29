import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ICONS } from '@shared/constants/base.constants';
import { RequestType } from '@shared/enums/request-type.enum';

@Component({
  selector: 'app-request-type-badge',
  templateUrl: './request-type-badge.component.html',
  styleUrls: ['./request-type-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTypeBadgeComponent {
  @Input() type!: RequestType;

  get icon() {
    switch (this.type) {
      case RequestType.Return:
        return ICONS.ORDER_RETURN_REQUEST;
      case RequestType.FundsWithdrawal:
        return ICONS.FUNDS_WITHDRAWAL_REQUEST;
      default:
        return ICONS.DEFAULT;
    }
  }
}
