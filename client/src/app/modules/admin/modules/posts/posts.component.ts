import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

import { Component } from '@angular/core';

import { Post } from '@shared/interfaces/entities/post.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';
import { PostsService } from '@shared/services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent {
  postPage$ = new BehaviorSubject<Page<Post> | null>(null);
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
  ) {
    this.updatePosts();
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
    this.postsService.delete(post.id).subscribe(() => {
      this.updatePosts();
      this.messageService.add({
        severity: 'success',
        detail: 'Новину видалено',
      });
    });
  }

  updatePosts() {
    this.postsService
      .getAll(
        new PageOptions({
          rows: this.rows,
          first: this.first,
        }),
      )
      .subscribe((postPage) => {
        this.postPage$.next(postPage);
      });
  }
}
