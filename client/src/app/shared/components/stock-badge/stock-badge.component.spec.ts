import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBadgeComponent } from './stock-badge.component';

describe('StockBadgeComponent', () => {
  let component: StockBadgeComponent;
  let fixture: ComponentFixture<StockBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
