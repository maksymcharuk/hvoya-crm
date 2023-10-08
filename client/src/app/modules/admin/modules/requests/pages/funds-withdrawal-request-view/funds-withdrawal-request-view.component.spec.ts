import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsWithdrawalRequestViewComponent } from './funds-withdrawal-request-view.component';

describe('FundsWithdrawalRequestViewComponent', () => {
  let component: FundsWithdrawalRequestViewComponent;
  let fixture: ComponentFixture<FundsWithdrawalRequestViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundsWithdrawalRequestViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundsWithdrawalRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
