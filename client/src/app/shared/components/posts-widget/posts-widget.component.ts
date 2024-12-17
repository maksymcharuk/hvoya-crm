import { Store } from '@ngrx/store';
import { AppStore } from '@state/app.store';
import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { PageOptions } from '@shared/interfaces/page-options.interface';
import { getPosts } from '@shared/state/posts/post.actions';

@Component({
  selector: 'app-posts-widget',
  templateUrl: './posts-widget.component.html',
  styleUrls: ['./posts-widget.component.scss'],
})
export class PostsWidgetComponent {
  scrolled$ = new BehaviorSubject<boolean>(false);
  take = 5;

  postsPage$ = this.store.select((state) => state.posts.postsPage);

  constructor(private store: Store<AppStore>) {
    this.store.dispatch(
      getPosts({
        pageOptions: new PageOptions({ rows: this.take, first: 0 }),
      }),
    );
  }

  onScrolled() {
    this.scrolled$.next(true);
  }
}
