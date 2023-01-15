import jwt_encode from 'jwt-encode';

describe('Auth', () => {
  describe('Sign in', () => {
    it('Visits Sign In page', () => {
      cy.visit('/');
      cy.contains('Sign in');
    });

    it('Sign in as super admin', () => {
      cy.signInAsSuperAdmin();
    });

    it('Sign in as admin', () => {
      cy.signInAsAdmin();
    });

    it('Sign in as user', () => {
      cy.signInAsUser();
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
      const token = jwt_encode(
        {
          user: {
            id: 4,
            role: 'User',
          },
        },
        Cypress.env('JWT_SECRET'),
        { expiresIn: '10m' },
      );
      const uniquePassword = `Admin${Date.now()}`;

      cy.visit(resetPasswordUrl + `?token=${token}`);
      cy.get('input[type=password]').first().type(uniquePassword);
      cy.get('input[type=password]').first().blur();
      cy.get('input[type=password]').last().type(uniquePassword);
      cy.get('button[type=submit]').click();
      cy.url().should('contain', '/auth/sign-in');
    });
  });
});
