import { BehaviorSubject, Observable } from 'rxjs';

import { Component } from '@angular/core';

import { Post } from '@shared/interfaces/entities/post.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { PostsService } from '@shared/services/posts.service';

@Component({
  selector: 'app-posts-widget',
  templateUrl: './posts-widget.component.html',
  styleUrls: ['./posts-widget.component.scss'],
})
export class PostsWidgetComponent {
  postsPage$: Observable<Page<Post>>;
  scrolled$ = new BehaviorSubject<boolean>(false);
  take = 5;

  constructor(private postsService: PostsService) {
    this.postsPage$ = this.postsService.getAll(
      new PageOptions({ rows: this.take }),
    );
  }

  onScrolled() {
    this.scrolled$.next(true);
  }
}
