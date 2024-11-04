import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  postPage$ = new BehaviorSubject<Page<Post> | null>(null);
  postDialog!: boolean;
  postEntity = Post;
  currentDate = new Date();

  first = 0;
  rows = 5;

  postForm = this.formBuilder.nonNullable.group({
    id: [''],
    body: ['', Validators.required],
    isPublished: [false],
  });

  post$ = this.postForm.valueChanges;

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
    this.postDialog = true;
  }

  editPost(post: Post) {
    this.postDialog = true;
    setTimeout(() => {
      this.postForm.patchValue(post);
    });
  }

  hideDialog() {
    this.postDialog = false;
  }

  onPageChange(event: LazyLoadEvent) {
    this.first = event.first || 0;
    this.rows = event.rows || 5;

    this.updatePosts();
  }

  savePost() {
    const post = {
      id: this.postForm.value.id ?? '',
      body: this.postForm.value.body ?? '',
      isPublished: this.postForm.value.isPublished ?? false,
    };

    if (post.id) {
      this.postsService.update(post.id, post).subscribe(() => {
        this.updatePosts();
        this.messageService.add({
          severity: 'success',
          detail: 'Новину оновлено',
        });
      });
    } else {
      this.postsService.create(post).subscribe(() => {
        this.updatePosts();
        this.messageService.add({
          severity: 'success',
          detail: 'Новину додано',
        });
      });
    }

    this.postDialog = false;
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
