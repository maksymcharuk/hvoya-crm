import { signToken } from 'cypress/support/helpers';
import { QueryResult } from 'pg';

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
        });
    });

    it('Sign in as admin', () => {
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.signInAsAdmin();
          cy.contains(credentials.admin.firstName);
          cy.contains(credentials.admin.lastName);
        });
    });

    it('Sign in as user', () => {
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.signInAsUser();
          cy.contains(credentials.user.firstName);
          cy.contains(credentials.user.lastName);
          cy.contains(credentials.user.accountNumber);
        });
    });

    it('Sign in with invalid credentials', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signIn(uniqueEmail, '12345');
      cy.checkToastMessage('Користувача нe знайдено');
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
      cy.checkToastMessage(
        'Будь ласка, підтвердіть вашу електронну пошту. Ми відправили вам лист з посиланням для підтвердження.',
      );
    });

    it('Register new user, confirm email and try to sign in without user confirmation', () => {
      const email = `test+${Date.now()}@email.com`;
      const password = 'Test12345';
      cy.registerNewUser(email, password, { confirm: false });
      cy.signIn(email, password);
      cy.checkToastMessage(
        'Ваш акаунт ще не підтверджено. Зачекайте або зверніться до менеджера.',
      );
    });

    it('Register new user, confirm email, confirm user as SuperAdmin and sign in', () => {
      const email = `test+${Date.now()}@email.com`;
      const password = 'Test12345';
      cy.registerNewUser(email, password, { confirm: false });
      cy.signInAsSuperAdmin();
      cy.confirmUser(email);
      cy.logout();
      cy.signIn(email, password, { full: true });
    });
  });

  describe('Logout', () => {
    it('Logout as admin', () => {
      cy.signInAsAdmin({ full: true });
      cy.logout();
      cy.url().should('contain', '/auth/sign-in');
    });

    it('Logout as user', () => {
      cy.signInAsUser({ full: true });
      cy.logout();
      cy.url().should('contain', '/auth/sign-in');
    });
  });

  describe('Forgot password', () => {
    const forgotPasswordUrl = '/auth/forgot-password';

    it('Visits Forgot password page', () => {
      cy.visit(forgotPasswordUrl);
      cy.contains('Відновити пароль');
    });

    it('Request password reset', () => {
      cy.visit(forgotPasswordUrl);
      cy.fixture('auth.json')
        .as('authData')
        .then(({ credentials }) => {
          cy.get('input[type=email]').type(credentials.user.email);
          cy.get('button[type=submit]').click();
          cy.contains(
            `Інструкцію з відновлення паролю було надіслано на вашу пошту: ${credentials.user.email}`,
          );
        });
    });

    it('Request password reset using incorrect email', () => {
      cy.visit(forgotPasswordUrl);
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.get('input[type=email]').type(uniqueEmail);
      cy.get('button[type=submit]').click();
      cy.contains('Користувача з такою електронною поштою не знайдено');
    });
  });

  describe('Reset password', () => {
    const resetPasswordUrl = '/auth/reset-password';

    it('Visits Reset password page without token', () => {
      cy.visit(resetPasswordUrl);
      cy.url().should('contain', '/auth/sign-in');
    });

    it('Visits Reset password page with token and resets password', () => {
      cy.task<QueryResult>(
        'connectDB',
        `
          SELECT * 
          FROM public."user"
          WHERE id IN (SELECT id FROM public."user" WHERE "createdAt" = (SELECT MAX("createdAt") FROM public."user"))
          ORDER BY id ASC
          LIMIT 1
        `,
      ).then((res) => {
        const token = signToken(res.rows[0].id);
        const password = `Test${Date.now()}`;

        cy.resetPassword(password, token);
        cy.url().should('contain', '/auth/sign-in');
      });
    });

    it('Reset password and login with new one', () => {
      cy.task<QueryResult>(
        'connectDB',
        `
          SELECT * 
          FROM public."user"
          WHERE id IN (SELECT id FROM public."user" WHERE "createdAt" = (SELECT MAX("createdAt") FROM public."user"))
          ORDER BY id ASC
          LIMIT 1
        `,
      ).then((res) => {
        const user = res.rows[0];
        const token = signToken(user.id);
        const password = `Test${Date.now()}`;

        cy.resetPassword(password, token);
        cy.signIn(user.email, password, { full: true });
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
      cy.checkToastMessage('Будь ласка, перевірте свою електронну пошту');
    });
  });

  describe('Freezed user', () => {
    const email = `test+${Date.now()}@email.com`;
    const password = 'Test12345';

    it('Freeze user', () => {
      cy.registerNewUser(email, password, { confirm: true });
      cy.freezeUser(email);
      cy.signIn(email, password);
      cy.checkToastMessage(
        'Вибачте, ваш акаунт тимчасово призупинено. Зверніться до менеджера за більш детальною інформацією.',
      );
    });

    it('Unfreeze user', () => {
      cy.unFreezeUser(email);
      cy.signIn(email, password, { full: true });
    });
  });
});
