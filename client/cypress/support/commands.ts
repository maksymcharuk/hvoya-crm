// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    signIn(email: string, password: string): typeof signIn;
    signInAsSuperAdmin(): typeof signInAsSuperAdmin;
    signInAsAdmin(): typeof signInAsAdmin;
    signInAsUser(): typeof signInAsUser;
    signUp(email: string, password: string): typeof signUp;
  }
}

function signIn(email: string, password: string): void {
  cy.visit('/');
  cy.get('input[type=email]').type(email);
  cy.get('input[type=password]').type(password);
  cy.get('button[type=submit]').click();
}

function signInAsSuperAdmin(): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.superAdmin.email, credentials.superAdmin.password);
      cy.contains('Hello admin');
    });
}

function signInAsAdmin(): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.admin.email, credentials.admin.password);
      cy.contains('Hello admin');
    });
}

function signInAsUser(): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.user.email, credentials.user.password);
      cy.contains('Hello user');
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
