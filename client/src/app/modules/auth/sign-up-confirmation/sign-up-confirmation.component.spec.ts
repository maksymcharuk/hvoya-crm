import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpConfirmationComponent } from './sign-up-confirmation.component';

describe('SignUpConfirmationComponent', () => {
  let component: SignUpConfirmationComponent;
  let fixture: ComponentFixture<SignUpConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
