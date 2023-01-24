import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';

import { environment } from '@environment/environment';
import { GetProfileResponse } from '@shared/interfaces/responses/get-profile.response';
import { UpdateUserProfileDTO } from '@shared/interfaces/dto/update-user-profile.dto';
import { UpdateAdminProfileDTO } from '@shared/interfaces/dto/update-admin-profile.dto';

@Injectable()
export class AccountService {
  profile$ = new BehaviorSubject<GetProfileResponse | null>(null);

  constructor(private http: HttpClient) {
    this.getProfile()
      .pipe(shareReplay())
      .subscribe((profile) => {
        this.profile$.next(profile);
      });
  }

  getProfile(): Observable<GetProfileResponse> {
    return this.http.get<GetProfileResponse>(
      `${environment.apiUrl}/account/profile`,
    );
  }

  updateProfile(
    updateUserProfileDTO: UpdateUserProfileDTO | UpdateAdminProfileDTO,
  ): Observable<GetProfileResponse> {
    return this.http
      .put<GetProfileResponse>(
        `${environment.apiUrl}/account/profile`,
        updateUserProfileDTO,
      )
      .pipe(tap((profile) => this.profile$.next(profile)));
  }
}
