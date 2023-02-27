describe('Orders', () => {
  let newOrderId: string;

  describe('User', () => {
    const testUserEmail = `user+${Date.now()}@email.com`;
    const testUserPassword = 'Test12345';

    before(() => {
      cy.registerNewUser(testUserEmail, testUserPassword);
    });

    beforeEach(() => {
      cy.signIn(testUserEmail, testUserPassword, { full: true });
    });

    it('Place order', () => {
      // Add product to cart
      cy.addProductToCart();

      // Place order
      cy.openShoppingCartWidget();
      cy.getCyEl('cart-widget-checkout-button').click();
      cy.fillAndSubmitCreateOrderForm({
        phoneNumber: '0671232123',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Middle',
        deliveryType: 'Test delivery type',
        city: 'Test city',
        postOffice: 'Test post office',
        trackingId: '1234556789',
      });
      cy.checkToastMessage('Ваше замовлення');
      cy.getCyEl('order-view-page').should('exist');

      // Check order in orders list
      cy.getCyEl('menu-item').contains('Замовлення').click();
      cy.getCyEl('order-list-item').should('have.length', 1);
      cy.getCyEl('order-list-item-id')
        .invoke('text')
        .then((text) => {
          newOrderId = text;

          // Check order details
          cy.getCyEl('order-list-item').click();
          cy.getCyEl('order-view-page').should('exist');
          cy.should('contain', `№${newOrderId}`);
        });
    });
  });

  describe('Admin', () => {
    const data = [
      {
        role: 'SuperAdmin',
        signInMethod: cy.signInAsSuperAdmin,
      },
      {
        role: 'Admin',
        signInMethod: cy.signInAsAdmin,
      },
    ];

    data.forEach((item) => {
      it(`Check new order as ${item.role}`, () => {
        item.signInMethod();

        // Check order in orders list
        cy.getCyEl('menu-item').contains('Замовлення').click();
        cy.getCyEl('order-list-item').should('have.length.gte', 1);
        cy.getCyEl('order-list-item-id').contains(newOrderId).should('exist');
      });

      it(`Change order status as ${item.role}`, () => {
        item.signInMethod();

        // Proceed to order details
        cy.getCyEl('menu-item').contains('Замовлення').click();
        cy.getCyEl('order-list-item-id').contains(newOrderId).click();
        cy.getCyEl('order-view-page').should('exist');

        // Change order status
        cy.getCyEl('order-status-current').should('contain', 'В очікуванні');
        cy.getCyEl('order-status-edit-button').click();
        cy.selectFromDropdown('order-status-edit-dropdown', 'Опрацьовується');
        cy.checkToastMessage('Статус замовлення успішно оновлено');

        // Revert order status
        cy.getCyEl('order-status-edit-button').click();
        cy.selectFromDropdown('order-status-edit-dropdown', 'В очікуванні');
        cy.checkToastMessage('Статус замовлення успішно оновлено');
      });
    });
  });
});
