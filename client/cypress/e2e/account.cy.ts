describe('Account', () => {
  describe('Profile', () => {
    const email = `test+${Date.now()}@email.com`;
    const password = 'Test12345';

    it('Sign up as new user and update profile with valid data', () => {
      cy.singUpAndConfirmEmail(email, password);
      cy.signIn(email, password, { full: true });
      cy.openAccountPage();

      const phoneNumber = '0671234567';
      const phoneNumberFormated = '+38 (067) 123-4567';
      const firstName = 'TestFname';
      const lastName = 'TestLname';
      const location = 'TestLocation';
      const bio = 'TestBio';
      const cardNumber = '5218 5722 2223 2634';
      const cardholderName = 'Test Cardholder';

      cy.get('input[id="phone-number"]').clear().type(phoneNumber);
      cy.get('input[id="first-name"]').clear().type(firstName);
      cy.get('input[id="last-name"]').clear().type(lastName);
      cy.get('input[id="location"]').clear().type(location);
      cy.get('textarea[id="about"]').clear().type(bio);
      cy.get('input[id="card-number"]').clear().type(cardNumber);
      cy.get('input[id="cardholder-name"]').clear().type(cardholderName);

      cy.get('button[type=submit]').click();

      cy.get('[role="alert"]').contains('Profile updated successfully');
      cy.get('.user-info .user-info__name').contains(
        `${firstName} ${lastName}`,
      );

      cy.reload();

      cy.get('input[id="phone-number"]').should(
        'have.value',
        phoneNumberFormated,
      );
      cy.get('input[id="first-name"]').should('have.value', firstName);
      cy.get('input[id="last-name"]').should('have.value', lastName);
      cy.get('input[id="location"]').should('have.value', location);
      cy.get('textarea[id="about"]').should('have.value', bio);
      cy.get('input[id="card-number"]').should('have.value', cardNumber);
      cy.get('input[id="cardholder-name"]').should(
        'have.value',
        cardholderName,
      );
      cy.get('.user-info .user-info__name').contains(
        `${firstName} ${lastName}`,
      );
    });

    it('Sign in and try to update profile with invalid phone number', () => {
      cy.signIn(email, password, { full: true });
      cy.openAccountPage();

      const phoneNumber = '067123456';

      cy.get('input[id="phone-number"]').clear().type(phoneNumber);
      cy.get('button[type=submit]').click();
      cy.get('[role="alert"]').contains('Phone number is not valid');
    });

    it('Sign in and try to update profile with invalid card data', () => {
      cy.signIn(email, password, { full: true });
      cy.openAccountPage();

      const invalidCardNumber = '5218 5722 2223 263';

      cy.get('input[id="card-number"]').clear().type(invalidCardNumber);
      cy.get('button[type=submit]').click();
      cy.get('[role="alert"]').contains('Card number is not valid');

      const validCardNumber = '5218 5722 2223 2634';

      cy.get('input[id="card-number"]').clear().type(validCardNumber);
      cy.get('input[id="cardholder-name"]').clear();
      cy.get('button[type=submit]').click();
      cy.get('[role="alert"]').contains('Cardholder name is required');
    });
  });
});
