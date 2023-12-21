import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { CreatePostDTO } from '@shared/interfaces/dto/create-post.dto';
import { UpdatePostDTO } from '@shared/interfaces/dto/update-post.dto';
import { Post } from '@shared/interfaces/entities/post.entity';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  constructor(private readonly http: HttpClient) {}

  getAll(pageOptions: PageOptions): Observable<Page<Post>> {
    let params = new HttpParams({ fromObject: pageOptions.toParams() });

    return this.http
      .get<Page<Post>>(`${environment.apiUrl}/post`, {
        params,
      })
      .pipe(
        map((posts) => ({
          data: posts.data.map((post) => new Post(post)),
          meta: posts.meta,
        })),
      );
  }

  findById(id: string): Observable<Post> {
    return this.http
      .get<Post>(`${environment.apiUrl}/post/${id}`)
      .pipe(map((post) => new Post(post)));
  }

  create(post: CreatePostDTO): Observable<Post> {
    return this.http
      .post<Post>(`${environment.apiUrl}/post`, post)
      .pipe(map((post) => new Post(post)));
  }

  update(id: string, post: UpdatePostDTO): Observable<Post> {
    return this.http
      .put<Post>(`${environment.apiUrl}/post/${id}`, post)
      .pipe(map((post) => new Post(post)));
  }

  updateBatch(postList: UpdatePostDTO[]): Observable<Post[]> {
    return this.http
      .put<Post[]>(`${environment.apiUrl}/post`, postList)
      .pipe(map((postList) => postList.map((post) => new Post(post))));
  }

  delete(id: string): Observable<Post> {
    return this.http
      .delete<Post>(`${environment.apiUrl}/post/${id}`)
      .pipe(map((post) => new Post(post)));
  }
}
