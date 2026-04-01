import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';

import { FormControlErrorMessageComponent } from './form-control-error-message.component';

describe('FormControlErrorMessageComponent', () => {
  let component: FormControlErrorMessageComponent;
  let fixture: ComponentFixture<FormControlErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormControlErrorMessageComponent],
      imports: [MessageModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormControlErrorMessageComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      field: new FormControl('', Validators.required),
    });
    component.controlName = 'field';
    component.errorType = 'required';
    component.errorMessage = 'Field is required';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
