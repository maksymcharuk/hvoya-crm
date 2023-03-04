describe('Account', () => {
  describe('Users', () => {
    describe('Profile', () => {
      const testUserPassword = 'Test12345';
      let testUserEmail: string;

      before(() => {
        testUserEmail = `user+${Date.now()}@email.com`;
        cy.registerNewUser(testUserEmail, testUserPassword, { confirm: true });
      });

      beforeEach(() => {
        cy.signIn(testUserEmail, testUserPassword, { full: true });
        cy.openAccountPage();
      });

      it('Sign up as user and update profile with valid data', () => {
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

        cy.checkToastMessage('Профіль було успішно оновлено');
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

      it('Sign in as user and try to update profile with invalid phone number', () => {
        const phoneNumber = '067123456';

        cy.get('input[id="phone-number"]').clear().type(phoneNumber);
        cy.get('button[type=submit]').click();
        cy.checkToastMessage('Номер телефону недійсний');
      });

      it('Sign in as user and try to update profile with invalid card data', () => {
        const invalidCardNumber = '5218 5722 2223 263';

        cy.get('input[id="card-number"]').clear().type(invalidCardNumber);
        cy.get('button[type=submit]').click();
        cy.checkToastMessage('Номер картки недійсний');

        const validCardNumber = '5218 5722 2223 2634';

        cy.get('input[id="card-number"]').clear().type(validCardNumber);
        cy.get('input[id="cardholder-name"]').clear();
        cy.get('button[type=submit]').click();
        cy.checkToastMessage("Потрібне ім'я власника картки");
      });
    });

    describe('Settings', () => {
      describe('Change password', () => {
        const testUserPassword = 'Test12345';
        const userUpdatedPassword = 'UserPassword123';
        let testUserEmail: string;

        before(() => {
          testUserEmail = `user+${Date.now()}@email.com`;
          cy.registerNewUser(testUserEmail, testUserPassword, {
            confirm: true,
          });
        });

        it('Sign up as user and change password', () => {
          cy.signIn(testUserEmail, testUserPassword, { full: true });
          cy.openSettingsPage();

          cy.get('input[id="current-password"]').clear().type(testUserPassword);
          cy.get('input[id="password"]')
            .clear()
            .type(userUpdatedPassword)
            .blur();
          cy.get('input[id="confirm-password"]')
            .clear()
            .type(userUpdatedPassword);
          cy.get('button[type=submit]').click();
          cy.checkToastMessage('Пароль було успішно оновлено');
        });

        it('Sign in as user with new password', () => {
          cy.signIn(testUserEmail, userUpdatedPassword, { full: true });
        });
      });
    });
  });

  describe('Admins', () => {
    describe('Profile', () => {
      const testAdminPassword = 'Admin12345';
      let testAdminEmail: string;

      before(() => {
        testAdminEmail = `admin+${Date.now()}@email.com`;
        cy.registerNewAdmin(testAdminEmail, testAdminPassword);
      });

      beforeEach(() => {
        cy.signIn(testAdminEmail, testAdminPassword, { full: true });
        cy.openAccountPage();
      });

      it('Sign up as admin and try to update profile with valid data', () => {
        const phoneNumber = '0671234567';
        const phoneNumberFormated = '+38 (067) 123-4567';
        const firstName = 'TestFname';
        const lastName = 'TestLname';

        cy.get('input[id="phone-number"]').clear().type(phoneNumber);
        cy.get('input[id="first-name"]').clear().type(firstName);
        cy.get('input[id="last-name"]').clear().type(lastName);

        cy.get('button[type=submit]').click();

        cy.checkToastMessage('Профіль було успішно оновлено');
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
        cy.get('.user-info .user-info__name').contains(
          `${firstName} ${lastName}`,
        );
      });

      it('Sign in as admin and try to update profile with invalid phone number', () => {
        const phoneNumber = '067123456';

        cy.get('input[id="phone-number"]').clear().type(phoneNumber);
        cy.get('button[type=submit]').click();
        cy.checkToastMessage('Номер телефону недійсний');
      });
    });

    describe('Settings', () => {
      describe('Change password', () => {
        const testAdminPassword = 'Admin12345';
        const adminUpdatedPassword = 'AdminPassword123';
        let testAdminEmail: string;

        before(() => {
          testAdminEmail = `admin+${Date.now()}@email.com`;
          cy.registerNewAdmin(testAdminEmail, testAdminPassword);
        });

        it('Sign up as admin and change password', () => {
          cy.signIn(testAdminEmail, testAdminPassword, { full: true });
          cy.openSettingsPage();
          cy.get('input[id="current-password"]')
            .clear()
            .type(testAdminPassword);
          cy.get('input[id="password"]')
            .clear()
            .type(adminUpdatedPassword)
            .blur();
          cy.get('input[id="confirm-password"]')
            .clear()
            .type(adminUpdatedPassword);
          cy.get('button[type=submit]').click();
          cy.checkToastMessage('Пароль було успішно оновлено');
        });

        it('Sign in as admin with new password', () => {
          cy.signIn(testAdminEmail, adminUpdatedPassword, { full: true });
        });
      });
    });
  });
});
