import { Store } from '@ngrx/store';
import { AppStore } from '@state/app.store';
import { BehaviorSubject, Observable } from 'rxjs';

import { Component } from '@angular/core';

import { Post } from '@shared/interfaces/entities/post.entity';
import { Page } from '@shared/interfaces/page.interface';

@Component({
  selector: 'app-posts-widget',
  templateUrl: './posts-widget.component.html',
  styleUrls: ['./posts-widget.component.scss'],
})
export class PostsWidgetComponent {
  postsPage$: Observable<Page<Post> | null>;
  scrolled$ = new BehaviorSubject<boolean>(false);
  take = 5;

  constructor(private store: Store<AppStore>) {
    this.postsPage$ = this.store.select((state) => state.posts.postsPage);
  }

  onScrolled() {
    this.scrolled$.next(true);
  }
}
