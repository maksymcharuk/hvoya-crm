import { UsersService } from '../services/users.service';

describe('Account', () => {
  describe('Users', () => {
    describe('Profile', () => {
      const testUserPassword = 'Test12345';
      let testUserEmail: string;

      before(() => {
        const service = new UsersService();
        testUserEmail = `user+${Date.now()}@email.com`;
        service.createUser({
          email: testUserEmail,
          password: testUserPassword,
        });
      });

      beforeEach(() => {
        cy.signIn(testUserEmail, testUserPassword, { full: true });
        cy.openAccountPage();
      });

      it('Sign up as user and update profile with valid data', () => {
        const phoneNumber = '0673347200';
        const phoneNumberFormated = '+38 (067) 334-7200';
        const lastName = 'ТестПрізвище';
        const firstName = 'ТестІмя';
        const middleName = 'ТестПобатькові';
        const website = 'https://hvoya.com';

        cy.getCyEl('phone-number', 'input').clear().type(phoneNumber);
        cy.getCyEl('last-name').clear().type(lastName);
        cy.getCyEl('first-name').clear().type(firstName);
        cy.getCyEl('middle-name').clear().type(middleName);
        cy.getCyEl('website').clear().type(website);

        cy.getCyEl('submit').click();

        cy.checkToastMessage('Профіль було успішно оновлено');
        cy.get('.user-info .user-info__name').contains(
          `${lastName} ${firstName}`,
        );

        cy.reload();

        cy.getCyEl('phone-number', 'input').should(
          'have.value',
          phoneNumberFormated,
        );
        cy.getCyEl('last-name').should('have.value', lastName);
        cy.getCyEl('first-name').should('have.value', firstName);
        cy.getCyEl('middle-name').should('have.value', middleName);
        cy.getCyEl('website').should('have.value', website);
        cy.get('.user-info .user-info__name').contains(
          `${lastName} ${firstName}`,
        );
      });

      it('Sign in as user and try to update profile with invalid phone number', () => {
        const phoneNumber = '3473347200';
        cy.getCyEl('phone-number', 'input').clear().type(phoneNumber);
        cy.getCyEl('submit').click();
        cy.checkToastMessage('Номер телефону невірний');
      });
    });

    describe('Settings', () => {
      describe('Change password', () => {
        const testUserPassword = 'Test12345';
        const userUpdatedPassword = 'UserPassword123';
        let testUserEmail: string;

        before(() => {
          const service = new UsersService();
          testUserEmail = `user+${Date.now()}@email.com`;
          service.createUser({
            email: testUserEmail,
            password: testUserPassword,
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
          cy.getCyEl('submit').click();
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
        const service = new UsersService();
        testAdminEmail = `admin+${Date.now()}@email.com`;
        service.createAdmin(
          {
            password: testAdminPassword,
          },
          testAdminEmail,
        );
      });

      beforeEach(() => {
        cy.signIn(testAdminEmail, testAdminPassword, { full: true });
        cy.openAccountPage();
      });

      it('Sign up as admin and try to update profile with valid data', () => {
        const phoneNumber = '0673347200';
        const phoneNumberFormated = '+38 (067) 334-7200';
        const lastName = 'ТестПрізвище';
        const firstName = 'ТестІмя';
        const middleName = 'ТестПобатькові';

        cy.getCyEl('phone-number', 'input').clear().type(phoneNumber);
        cy.getCyEl('first-name').clear().type(firstName);
        cy.getCyEl('last-name').clear().type(lastName);
        cy.getCyEl('middle-name').clear().type(middleName);

        cy.getCyEl('submit').click();

        cy.checkToastMessage('Профіль було успішно оновлено');
        cy.get('.user-info .user-info__name').contains(
          `${lastName} ${firstName}`,
        );

        cy.reload();

        cy.getCyEl('phone-number', 'input').should(
          'have.value',
          phoneNumberFormated,
        );
        cy.getCyEl('first-name').should('have.value', firstName);
        cy.getCyEl('last-name').should('have.value', lastName);
        cy.getCyEl('middle-name').should('have.value', middleName);
        cy.get('.user-info .user-info__name').contains(
          `${lastName} ${firstName}`,
        );
      });

      it('Sign in as admin and try to update profile with invalid phone number', () => {
        const phoneNumber = '3473347200';

        cy.getCyEl('phone-number', 'input').clear().type(phoneNumber);
        cy.getCyEl('submit').click();
        cy.checkToastMessage('Номер телефону невірний');
      });
    });

    describe('Settings', () => {
      describe('Change password', () => {
        const testAdminPassword = 'Admin12345';
        const adminUpdatedPassword = 'AdminPassword123';
        let testAdminEmail: string;

        before(() => {
          const service = new UsersService();
          testAdminEmail = `admin+${Date.now()}@email.com`;
          service.createAdmin(
            {
              password: testAdminPassword,
            },
            testAdminEmail,
          );
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
          cy.getCyEl('submit').click();
          cy.checkToastMessage('Пароль було успішно оновлено');
        });

        it('Sign in as admin with new password', () => {
          cy.signIn(testAdminEmail, adminUpdatedPassword, { full: true });
        });
      });
    });
  });
});
