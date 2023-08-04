import { QueryResult } from 'pg';

import { signCustomToken, signToken } from '../support/helpers';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  phoneNumber: string;
  storeName: string;
  website: string;
  bio: string;
}

export interface CreateAdminDto {
  firstName: string;
  lastName: string;
  middleName: string;
  password: string;
  phoneNumber: string;
  token: string;
}

interface ConfirmEmailDto {
  confirmEmailToken: string;
}

interface ConfirmUserDto {
  userId: string;
  managerId: string;
}

export class UsersService {
  private apiBaseUrl = Cypress.env('API_BASE_URL');
  private defaultAdminData: CreateAdminDto = {
    firstName: 'Admin',
    lastName: 'Admin',
    middleName: 'Admin',
    password: 'Test12345',
    phoneNumber: '0679876542',
    token: '',
  };
  private defaultUserData: CreateUserDto = {
    firstName: 'Test',
    lastName: 'Test',
    middleName: 'Test',
    email: 'test-user@email.com',
    password: 'Test12345',
    phoneNumber: '0679876542',
    storeName: 'Whole Foods',
    website: 'https://hvoya.com',
    bio: 'I am a test user',
  };

  createUser(data?: Partial<CreateUserDto>) {
    this.registerUser({
      ...this.defaultUserData,
      ...data,
    });
    this.getLatestUser().then((res) => {
      const userId = res.rows[0].id;

      this.confirmEmail({
        confirmEmailToken: signToken({ userId }),
      });

      this.getLatestSuperAdmin().then((res) => {
        const superAdminId = res.rows[0].id;

        this.confirmUser({
          userId,
          managerId: superAdminId,
        });
      });
    });
  }

  createAdmin(
    data: Partial<CreateAdminDto>,
    email: string,
    role: string = 'SuperAdmin',
  ) {
    const token = signCustomToken({ email, role });
    this.registerAdmin({ ...this.defaultAdminData, ...data, token });
  }

  registerAdmin(data: CreateAdminDto) {
    return cy.request({
      method: 'POST',
      url: `${this.apiBaseUrl}/auth/admin/sign-up`,
      body: data,
    });
  }

  registerUser(data: CreateUserDto) {
    return cy.request({
      method: 'POST',
      url: `${this.apiBaseUrl}/auth/sign-up`,
      body: data,
    });
  }

  confirmEmail(data: ConfirmEmailDto) {
    return cy.request({
      method: 'POST',
      url: `${this.apiBaseUrl}/auth/confirm-email`,
      body: data,
    });
  }

  confirmUser(data: ConfirmUserDto) {
    return cy.request({
      auth: {
        bearer: signToken({ userId: data.managerId }),
      },
      method: 'POST',
      url: `${this.apiBaseUrl}/users/confirm`,
      body: data,
    });
  }

  getUserByEmail(email: string) {
    return cy.task<QueryResult>(
      'connectDB',
      `
          SELECT *
          FROM public."user"
          WHERE email = '${email}'
          ORDER BY "createdAt" DESC
          LIMIT 1
        `,
    );
  }

  getLatestUser() {
    return cy.task<QueryResult>(
      'connectDB',
      `
          SELECT *
          FROM public."user"
          WHERE role = 'User'
          ORDER BY "createdAt" DESC
          LIMIT 1
        `,
    );
  }

  getLatestAdmin() {
    return cy.task<QueryResult>(
      'connectDB',
      `
          SELECT *
          FROM public."user"
          WHERE role = 'Admin'
          ORDER BY "createdAt" DESC
          LIMIT 1
        `,
    );
  }

  getLatestSuperAdmin() {
    return cy.task<QueryResult>(
      'connectDB',
      `
          SELECT *
          FROM public."user"
          WHERE role = 'SuperAdmin'
          ORDER BY "createdAt" DESC
          LIMIT 1
        `,
    );
  }

  getLatest() {
    return cy.task<QueryResult>(
      'connectDB',
      `
          SELECT * 
          FROM public."user"
          WHERE id IN (SELECT id FROM public."user" WHERE "createdAt" = (SELECT MAX("createdAt") FROM public."user"))
          LIMIT 1
        `,
    );
  }
}
