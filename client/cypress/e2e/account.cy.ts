describe('Account', () => {
  describe('Profile', () => {
    const email = `test+${Date.now()}@email.com`;
    const password = 'Test12345';

    it('Sign up as new user and edit profile', () => {
      cy.singUpAndConfirmEmail(email, password);
      cy.signIn(email, password);

      cy.contains('Hello user');

      cy.openAccountPage();

      const firstName = 'TestFname';
      const lastName = 'TestLname';

      cy.get('input[formcontrolname="firstName"]').clear().type(firstName);
      cy.get('input[formcontrolname="lastName"]').clear().type(lastName);

      cy.get('button[type=submit]').click();

      cy.get('[role="alert"]').contains('Profile updated successfully');
      cy.get('.user-info .user-info__name').contains(
        `${firstName} ${lastName}`,
      );
    });
  });
});
