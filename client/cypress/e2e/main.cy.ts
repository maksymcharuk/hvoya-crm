describe('Main', () => {
  describe('Visits the initial project page', () => {
    it('Redirected to Sign In page', () => {
      cy.visit('/');

      cy.url().should('include', '/auth/sign-in');
    });
  });
});
