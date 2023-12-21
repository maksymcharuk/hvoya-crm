import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsWidgetComponent } from './posts-widget.component';

describe('PostsWidgetComponent', () => {
  let component: PostsWidgetComponent;
  let fixture: ComponentFixture<PostsWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostsWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
