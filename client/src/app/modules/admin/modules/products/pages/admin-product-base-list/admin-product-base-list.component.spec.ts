import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductBaseListComponent } from './admin-product-base-list.component';

describe('AdminProductBaseListComponent', () => {
  let component: AdminProductBaseListComponent;
  let fixture: ComponentFixture<AdminProductBaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductBaseListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductBaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
