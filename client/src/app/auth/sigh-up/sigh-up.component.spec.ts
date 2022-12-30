import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SighUpComponent } from './sigh-up.component';

describe('SighUpComponent', () => {
  let component: SighUpComponent;
  let fixture: ComponentFixture<SighUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SighUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SighUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
