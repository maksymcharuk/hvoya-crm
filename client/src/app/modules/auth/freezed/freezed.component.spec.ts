import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezedComponent } from './freezed.component';

describe('FreezedComponent', () => {
  let component: FreezedComponent;
  let fixture: ComponentFixture<FreezedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreezedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreezedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
