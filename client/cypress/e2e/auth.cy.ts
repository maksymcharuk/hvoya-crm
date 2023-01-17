import { signToken } from 'cypress/support/helpers';

describe('Auth', () => {
  describe('Sign in', () => {
    it('Visits Sign In page', () => {
      cy.visit('/');
      cy.contains('Sign in');
    });

    it('Sign in as super admin', () => {
      cy.signInAsSuperAdmin();
      cy.contains('Hello admin');
    });

    it('Sign in as admin', () => {
      cy.signInAsAdmin();
      cy.contains('Hello admin');
    });

    it('Sign in as user', () => {
      cy.signInAsUser();
      cy.contains('Hello user');
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
      cy.contains('Sign up');
    });

    it('Register new user', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signUp(uniqueEmail, 'Test12345');
      cy.contains(uniqueEmail);
      cy.contains('Thank you for signing up');
    });

    it('Register new user and try to sign in without confirmation', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signUp(uniqueEmail, 'Test12345');
      cy.contains(uniqueEmail);
      cy.contains('Thank you for signing up');

      cy.signIn(uniqueEmail, 'Test12345');
      cy.get('[role="alert"]').contains('Email is not confirmed');
    });

    it('Register new user, confirm and sign in', () => {
      const uniqueEmail = `test+${Date.now()}@email.com`;
      cy.signUp(uniqueEmail, 'Test12345');
      cy.contains(uniqueEmail);
      cy.contains('Thank you for signing up');

      cy.task<any[]>(
        'connectDB',
        'SELECT * FROM public."user" ORDER BY id ASC',
      ).then((users) => {
        const token = signToken(users[users.length - 1].id);

        cy.visit(`/auth/confirm-email?token=${token}`);

        cy.signIn(uniqueEmail, 'Test12345');
        cy.contains('Hello user');
      });
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

  describe('Logout', () => {

    it('Logout as admin', () => {
      cy.signInAsAdmin();
      cy.contains('Hello admin');
      cy.logout();
      cy.url().should('contain', '/auth/sign-in');
    });

    it('Logout in as user', () => {
      cy.signInAsUser();
      cy.contains('Hello user');
      cy.logout();
      cy.url().should('contain', '/auth/sign-in');
    });

  });
});
