import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlErrorMessageComponent } from './form-control-error-message.component';

describe('FormControlErrorMessageComponent', () => {
  let component: FormControlErrorMessageComponent;
  let fixture: ComponentFixture<FormControlErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormControlErrorMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormControlErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
