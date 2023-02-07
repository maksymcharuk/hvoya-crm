// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************

import { signToken } from 'cypress/support/helpers';

// eslint-disable-next-line @typescript-eslint/no-namespace
interface SignInOptions {
  full: boolean;
}
declare global {
  namespace Cypress {
    interface Chainable {
      signIn(
        email: string,
        password: string,
        options?: SignInOptions,
      ): typeof signIn;
      signInAsSuperAdmin(options?: SignInOptions): typeof signInAsSuperAdmin;
      signInAsAdmin(options?: SignInOptions): typeof signInAsAdmin;
      signInAsUser(options?: SignInOptions): typeof signInAsUser;
      signUp(email: string, password: string): typeof signUp;
      resetPassword(password: string, token: string): typeof resetPassword;
      registerNewAdmin(
        email: string,
        password: string,
      ): typeof registerNewAdmin;
      registerNewUser(email: string, password: string): typeof registerNewUser;
      logout(): typeof logout;
      openUserMenu(): typeof openUserMenu;
      openAccountPage(): typeof openAccountPage;
      openProfilePage(): typeof openProfilePage;
      openSettingsPage(): typeof openSettingsPage;
    }
  }
}

function signIn(
  email: string,
  password: string,
  options: SignInOptions = { full: false },
): void {
  cy.visit('/');
  cy.get('input[type=email]').type(email);
  cy.get('input[type=password]').type(password);
  cy.get('button[type=submit]').click();
  if (options.full) {
    cy.get('.layout-topbar-logo').should('be.visible');
  }
}

function signInAsSuperAdmin(options?: SignInOptions): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(
        credentials.superAdmin.email,
        credentials.superAdmin.password,
        options,
      );
    });
}

function signInAsAdmin(options?: SignInOptions): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.admin.email, credentials.admin.password, options);
    });
}

function signInAsUser(options?: SignInOptions): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.user.email, credentials.user.password, options);
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

function openProfilePage(): void {
  cy.openUserMenu();
  cy.get('li').contains('Profile').click();
}

function openSettingsPage(): void {
  cy.openAccountPage();
  cy.get('li').contains('Settings').click();
}

function registerNewUser(email: string, password: string): void {
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

function registerNewAdmin(email: string, password: string): void {
  cy.registerNewUser(email, password);
  cy.task<any[]>(
    'connectDB',
    `UPDATE public."user" 
      SET role = 'Admin'::user_role_enum
      WHERE id = (SELECT max(id) FROM public."user")`,
  );
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
Cypress.Commands.add('registerNewAdmin', registerNewAdmin);
Cypress.Commands.add('registerNewUser', registerNewUser);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('openUserMenu', openUserMenu);
Cypress.Commands.add('openAccountPage', openAccountPage);
Cypress.Commands.add('openProfilePage', openProfilePage);
Cypress.Commands.add('openSettingsPage', openSettingsPage);
