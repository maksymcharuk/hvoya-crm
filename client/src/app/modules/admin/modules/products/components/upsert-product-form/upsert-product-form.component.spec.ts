import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertProductFormComponent } from './upsert-product-form.component';

describe('UpsertProductFormComponent', () => {
  let component: UpsertProductFormComponent;
  let fixture: ComponentFixture<UpsertProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertProductFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
