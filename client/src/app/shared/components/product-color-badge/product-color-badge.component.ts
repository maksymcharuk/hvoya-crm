import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductColor } from '@shared/interfaces/entities/product.entity';

@Component({
  selector: 'app-product-color-badge',
  templateUrl: './product-color-badge.component.html',
  styleUrls: ['./product-color-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductColorBadgeComponent {
  @Input() color!: ProductColor;
  @Input() size = '14px';

  get title(): string {
    return this.color.name;
  }

  get gradient(): string {
    const colors = this.color.hex.split(', ');
    const angleStep = 360 / colors.length;
    const angles = Array.from(
      { length: colors.length },
      (_, i) => `${i * angleStep}deg`,
    );
    const stops = angles.map(
      (angle, i) => `${angle} ${angles[(i + 1) % angles.length]}`,
    );
    return `conic-gradient(${colors
      .map((color, i) => `${color} ${stops[i]}`)
      .join(', ')})`;
  }
}
