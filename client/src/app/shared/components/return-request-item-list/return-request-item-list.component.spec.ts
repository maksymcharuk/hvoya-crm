import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestItemListComponent } from './return-request-item-list.component';

describe('ReturnRequestItemListComponent', () => {
  let component: ReturnRequestItemListComponent;
  let fixture: ComponentFixture<ReturnRequestItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnRequestItemListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnRequestItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
