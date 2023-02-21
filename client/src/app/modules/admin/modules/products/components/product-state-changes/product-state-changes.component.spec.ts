import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStateChangesComponent } from './product-state-changes.component';

describe('ProductStateChangesComponent', () => {
  let component: ProductStateChangesComponent;
  let fixture: ComponentFixture<ProductStateChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductStateChangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductStateChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
