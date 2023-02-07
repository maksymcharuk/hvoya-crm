import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { ChangePasswordDTO } from '@shared/interfaces/dto/change-password.dto';
import { UpdateAdminProfileDTO } from '@shared/interfaces/dto/update-admin-profile.dto';
import { UpdateUserProfileDTO } from '@shared/interfaces/dto/update-user-profile.dto';
import { GetProfileResponse } from '@shared/interfaces/responses/get-profile.response';

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

  changePassword(changePasswordDTO: ChangePasswordDTO): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/account/change-password`,
      changePasswordDTO,
    );
  }
}
