import { signToken } from 'cypress/support/helpers';

describe('Auth', () => {
  describe('Sign in', () => {
    it('Visits Sign In page', () => {
      cy.visit('/');
      cy.contains('Вхід');
    });

    it('Sign in as super admin', () => {
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.signInAsSuperAdmin();
          cy.contains(credentials.superAdmin.firstName);
          cy.contains(credentials.superAdmin.lastName);
          cy.contains(credentials.superAdmin.email);
        });
    });

    it('Sign in as admin', () => {
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.signInAsAdmin();
          cy.contains(credentials.admin.firstName);
          cy.contains(credentials.admin.lastName);
          cy.contains(credentials.admin.email);
        });
    });

    it('Sign in as user', () => {
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.signInAsUser();
          cy.contains(credentials.user.firstName);
          cy.contains(credentials.user.lastName);
          cy.contains(credentials.user.email);
        });
    });

    it('Sign in with invalid credentials', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signIn(uniqueEmail, '12345');
      cy.get('[role="alert"]').contains('User not found');
    });
  });

  describe('Sign up', () => {
    it('Visits Sign Up page', () => {
      cy.visit('/auth/sign-up');
      cy.contains('Реєстрація');
    });

    it('Register new user', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signUp(uniqueEmail, 'Test12345');
      cy.contains(uniqueEmail);
      cy.contains('Дякуємо за реєстрацію');
    });

    it('Register new user and try to sign in without confirmation', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signUp(uniqueEmail, 'Test12345');
      cy.contains(uniqueEmail);
      cy.contains('Дякуємо за реєстрацію');

      cy.signIn(uniqueEmail, 'Test12345');
      cy.get('[role="alert"]').contains('Email is not confirmed');
    });

    it('Register new user, confirm email and try to sign in without user confirmation', () => {
      const email = `test+${Date.now()}@email.com`;
      const password = 'Test12345';
      cy.registerNewUser(email, password);
      cy.signIn(email, password);
      cy.get('[role="alert"]').contains('User is not confirmed');
    });

    it('Register new user, confirm email, confirm user as SuperAdmin and sign in', () => {
      const email = `test+${Date.now()}@email.com`;
      const password = 'Test12345';
      cy.registerNewUser(email, password);
      cy.signInAsSuperAdmin();
      cy.confirmUser(email);
      cy.logout();
      cy.signIn(email, password);
      cy.contains('Hello user');
    });
  });

  describe('Logout', () => {
    it('Logout as admin', () => {
      cy.signInAsAdmin();
      cy.contains('Hello admin');
      cy.logout();
      cy.url().should('contain', '/auth/sign-in');
    });

    it('Logout as user', () => {
      cy.signInAsUser();
      cy.contains('Hello user');
      cy.logout();
      cy.url().should('contain', '/auth/sign-in');
    });
  });

  describe('Forgot password', () => {
    const forgotPasswordUrl = '/auth/forgot-password';

    it('Visits Forgot password page', () => {
      cy.visit(forgotPasswordUrl);
      cy.contains('Forgot password');
    });

    it('Request password reset', () => {
      cy.visit(forgotPasswordUrl);
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.get('input[type=email]').type(credentials.user.email);
          cy.get('button[type=submit]').click();
          cy.contains(
            `Reset password set to your email ${credentials.user.email}`,
          );
        });
    });

    it('Request password reset using incorrect email', () => {
      cy.visit(forgotPasswordUrl);
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.get('input[type=email]').type(uniqueEmail);
      cy.get('button[type=submit]').click();
      cy.contains('User with such email does not exist');
    });
  });

  describe('Reset password', () => {
    const resetPasswordUrl = '/auth/reset-password';

    it('Visits Reset password page without token', () => {
      cy.visit(resetPasswordUrl);
      cy.url().should('contain', '/auth/sign-in');
    });

    it('Visits Reset password page with token and resets password', () => {
      cy.task<any[]>(
        'connectDB',
        'SELECT * FROM public."user" ORDER BY id ASC',
      ).then((users) => {
        const token = signToken(users[users.length - 1].id);
        const password = `Test${Date.now()}`;

        cy.resetPassword(password, token);
        cy.url().should('contain', '/auth/sign-in');
      });
    });

    it('Reset password and login with new one', () => {
      cy.task<any[]>(
        'connectDB',
        'SELECT * FROM public."user" ORDER BY id ASC',
      ).then((users) => {
        const user = users[users.length - 1];
        const token = signToken(user.id);
        const password = `Test${Date.now()}`;

        cy.resetPassword(password, token);
        cy.signIn(user.email, password);
        cy.contains('Hello user');
      });
    });
  });

  describe('Send email confirmation if email is not confirmed', () => {
    it('Send email confirmation on sing in if not confirmed', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signUp(uniqueEmail, 'Test12345');
      cy.contains(uniqueEmail);
      cy.contains('Дякуємо за реєстрацію');

      cy.signIn(uniqueEmail, 'Test12345');
      cy.get('[role="alert"]').contains(
        'Please check your email to confirm your account',
      );
    });
  });

  describe('Freezed user', () => {
    const email = `test+${Date.now()}@email.com`;
    const password = 'Test12345';

    it('Freeze user', () => {
      cy.registerNewUser(email, password);
      cy.signInAsSuperAdmin();
      cy.confirmUser(email);
      cy.freezeUser(email);
      cy.logout();
      cy.signIn(email, password);
      cy.get('[role="alert"]').contains('User is freezed');
    });

    it('unfreeze user', () => {
      cy.signInAsSuperAdmin();
      cy.unFreezeUser(email);
      cy.logout();
      cy.signIn(email, password);
      cy.contains('Hello user');
    });
  });
});
