// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
import { signToken } from 'cypress/support/helpers';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    signIn(email: string, password: string): typeof signIn;
    signInAsSuperAdmin(): typeof signInAsSuperAdmin;
    signInAsAdmin(): typeof signInAsAdmin;
    signInAsUser(): typeof signInAsUser;
    signUp(email: string, password: string): typeof signUp;
    resetPassword(password: string, token: string): typeof resetPassword;
    singUpAndConfirmEmail(): typeof singUpAndConfirmEmail;
    logout(): typeof logout;
    openUserMenu(): typeof openUserMenu;
    openAccountPage(): typeof openAccountPage;
  }
}

function signIn(
  email: string,
  password: string,
  options: { full: boolean } = { full: false },
): void {
  cy.visit('/');
  cy.get('input[type=email]').type(email);
  cy.get('input[type=password]').type(password);
  cy.get('button[type=submit]').click();
  if (options.full) {
    cy.get('.layout-topbar-logo').should('be.visible');
  }
}

function signInAsSuperAdmin(): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.superAdmin.email, credentials.superAdmin.password);
    });
}

function signInAsAdmin(): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.admin.email, credentials.admin.password);
    });
}

function signInAsUser(): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.user.email, credentials.user.password);
    });
}

function signUp(email: string, password: string): void {
  cy.visit('/auth/sign-up');
  cy.get('input[type=email]').type(email);
  cy.get('input[type=password]').first().type(password);
  cy.get('input[type=password]').first().blur();
  cy.get('input[type=password]').last().type(password);
  cy.get('button[type=submit]').click();
}

function resetPassword(password: string, token: string): void {
  cy.visit(`/auth/reset-password?token=${token}`);
  cy.get('input[type=password]').first().type(password);
  cy.get('input[type=password]').first().blur();
  cy.get('input[type=password]').last().type(password);
  cy.get('button[type=submit]').click();
}

function openUserMenu(): void {
  cy.get('i.pi-user').click();
}

function logout(): void {
  cy.openUserMenu();
  cy.get('.p-button-label').contains('Logout').click();
}

function openAccountPage(): void {
  cy.openUserMenu();
  cy.get('.p-button-label').contains('Account').click();
}

function singUpAndConfirmEmail(email: string, password: string): void {
  cy.signUp(email, password);
  cy.contains(email);
  cy.contains('Thank you for signing up');

  cy.task<any[]>(
    'connectDB',
    'SELECT * FROM public."user" ORDER BY id ASC',
  ).then((users) => {
    const token = signToken(users[users.length - 1].id);

    cy.visit(`/auth/confirm-email?token=${token}`);
  });
}

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("signIn", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('signIn', signIn);
Cypress.Commands.add('signInAsSuperAdmin', signInAsSuperAdmin);
Cypress.Commands.add('signInAsAdmin', signInAsAdmin);
Cypress.Commands.add('signInAsUser', signInAsUser);
Cypress.Commands.add('signUp', signUp);
Cypress.Commands.add('resetPassword', resetPassword);
Cypress.Commands.add('singUpAndConfirmEmail', singUpAndConfirmEmail);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('openUserMenu', openUserMenu);
Cypress.Commands.add('openAccountPage', openAccountPage);
