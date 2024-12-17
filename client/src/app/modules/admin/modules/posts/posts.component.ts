import { ActionsSubject, Store } from '@ngrx/store';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import { Component } from '@angular/core';

import { Post } from '@shared/interfaces/entities/post.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { PostsService } from '@shared/services/posts.service';

import {
  deletePost,
  deletePostSuccess,
  getPosts,
} from '../../../../shared/state/posts/post.actions';
import { PostState } from '../../../../shared/state/posts/post.reducer';
import { selectPostsPage } from '../../../../shared/state/posts/post.selectors';

@Component({
  selector: 'app-post',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  postPage$ = this.store.select(selectPostsPage);
  postDialog!: boolean;
  post!: Post;
  submitted!: boolean;
  postEntity = Post;
  currentDate = new Date();

  first = 0;
  rows = 5;

  constructor(
    private readonly postsService: PostsService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly store: Store<PostState>,
    private readonly actions$: ActionsSubject,
  ) {
    this.updatePosts();
    this.actions$.subscribe((action) => {
      if (action.type === deletePostSuccess.type) {
        this.store.dispatch(
          getPosts({
            pageOptions: new PageOptions({
              rows: this.rows,
              first: this.first,
            }),
          }),
        );
      }
    });
  }

  confirmToggle(post: Post) {
    this.confirmationService.confirm({
      accept: () => {
        this.deletePost(post);
      },
    });
  }

  openNew() {
    this.post = { isPublished: true } as Post;
    this.submitted = false;
    this.postDialog = true;
  }

  editPost(post: Post) {
    this.post = { ...post };
    this.postDialog = true;
  }

  hideDialog() {
    this.postDialog = false;
    this.submitted = false;
  }

  onPageChange(event: LazyLoadEvent) {
    this.first = event.first || 0;
    this.rows = event.rows || 5;

    this.updatePosts();
  }

  savePost() {
    this.submitted = true;

    if (this.post.id) {
      this.postsService.update(this.post.id, this.post).subscribe(() => {
        this.updatePosts();
        this.messageService.add({
          severity: 'success',
          detail: 'Новину оновлено',
        });
      });
    } else {
      this.postsService.create(this.post).subscribe(() => {
        this.updatePosts();
        this.messageService.add({
          severity: 'success',
          detail: 'Новину додано',
        });
      });
    }

    this.postDialog = false;
    this.post = {} as Post;
  }

  deletePost(post: Post) {
    this.store.dispatch(
      deletePost({
        id: post.id,
      }),
    );
  }

  updatePosts() {
    this.store.dispatch(
      getPosts({
        pageOptions: new PageOptions({ rows: this.rows, first: this.first }),
      }),
    );
  }
}
