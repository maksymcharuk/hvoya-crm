import jwt_decode from 'jwt-decode';
import { Observable, map } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';
import { ConfirmUserDTO } from '@shared/interfaces/dto/confirm-user.dto';
import { SendAdminInvitationDTO } from '@shared/interfaces/dto/send-admin-invitation.dto';
import { UpdateUserByAdminDTO } from '@shared/interfaces/dto/update-user-by-admin.dto';
import { Order } from '@shared/interfaces/entities/order.entity';
import { PaymentTransaction } from '@shared/interfaces/entities/payment-transaction.entity';
import { TokenUser } from '@shared/interfaces/entities/token-user.entity';
import { User } from '@shared/interfaces/entities/user.entity';
import { JwtTokenPayload } from '@shared/interfaces/jwt-payload.interface';
import { PageOptions } from '@shared/interfaces/page-options.interface';
import { Page } from '@shared/interfaces/page.interface';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private tokenService: TokenService, private http: HttpClient) {}

  getUser(): TokenUser | null {
    const token = this.tokenService.getToken();

    if (!token) return null;
    const decodedToken: JwtTokenPayload = jwt_decode(token);

    return new TokenUser(decodedToken.user);
  }

  getUsers(pageOptions: PageOptions): Observable<Page<User>> {
    let params = new HttpParams({ fromObject: pageOptions.toParams() });

    return this.http
      .get<Page<User>>(`${environment.apiUrl}/users`, { params })
      .pipe(
        map((users) => ({
          data: users.data.map((user) => new User(user)),
          meta: users.meta,
        })),
      );
  }

  getUserOrders(
    userId: string,
    pageOptions?: PageOptions,
  ): Observable<Page<Order>> {
    let params = new HttpParams({ fromObject: pageOptions?.toParams() });

    return this.http
      .get<Page<Order>>(`${environment.apiUrl}/users/${userId}/orders`, {
        params,
      })
      .pipe(
        map((orders) => ({
          data: orders.data.map((order) => new Order(order)),
          meta: orders.meta,
        })),
      );
  }

  getUserPaymentTransactions(
    userId: string,
    pageOptions?: PageOptions,
  ): Observable<Page<PaymentTransaction>> {
    let params = new HttpParams({ fromObject: pageOptions?.toParams() });

    return this.http
      .get<Page<PaymentTransaction>>(
        `${environment.apiUrl}/users/${userId}/payment-transactions`,
        {
          params,
        },
      )
      .pipe(
        map((paymentTransaction) => ({
          data: paymentTransaction.data.map(
            (paymentTransaction) => new PaymentTransaction(paymentTransaction),
          ),
          meta: paymentTransaction.meta,
        })),
      );
  }

  getAdminUsers(userId: string, pageOptions?: PageOptions) {
    let params = new HttpParams({ fromObject: pageOptions?.toParams() });

    return this.http
      .get<Page<User>>(`${environment.apiUrl}/users/${userId}/users`, {
        params,
      })
      .pipe(
        map((user) => ({
          data: user.data.map((user) => new User(user)),
          meta: user.meta,
        })),
      );
  }

  getUserById(userId: string): Observable<User> {
    return this.http
      .get<User>(`${environment.apiUrl}/users/${userId}`)
      .pipe(map((user) => new User(user)));
  }

  updateUserByAdmin(
    userId: string,
    updateData: UpdateUserByAdminDTO,
  ): Observable<User> {
    return this.http
      .post<User>(
        `${environment.apiUrl}/users/${userId}/update-by-admin`,
        updateData,
      )
      .pipe(map((user) => new User(user)));
  }

  confirmUser(confirmUserDto: ConfirmUserDTO): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/confirm`, confirmUserDto)
      .pipe(map((user) => new User(user)));
  }

  freezeUserToggle(userId: string): Observable<User> {
    return this.http
      .post<User>(`${environment.apiUrl}/users/freeze-toggle`, { userId })
      .pipe(map((user) => new User(user)));
  }

  sendAdminInvitation(
    sendAdminInvitationDTO: SendAdminInvitationDTO,
  ): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/users/send-admin-invitation`,
      sendAdminInvitationDTO,
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${userId}`);
  }
}
