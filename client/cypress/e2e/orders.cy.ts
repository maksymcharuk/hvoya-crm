describe('Orders', () => {
  let newOrderId: string;

  describe('User', () => {
    const testUserEmail = `user+${Date.now()}@email.com`;
    const testUserPassword = 'Test12345';

    before(() => {
      cy.registerNewUser(testUserEmail, testUserPassword, { confirm: true });
    });

    beforeEach(() => {
      cy.signIn(testUserEmail, testUserPassword, { full: true });
    });

    it('Place order', () => {
      // Add funds to user balance
      cy.addFundsToUserBalance(testUserEmail, 5000);

      // Add product to cart
      cy.addProductToCart();

      // Place order
      cy.openShoppingCartWidget();
      cy.getCyEl('cart-widget-checkout-button').click();
      cy.fillAndSubmitCreateOrderForm({
        // phoneNumber: '0671232123',
        // firstName: 'John',
        // lastName: 'Doe',
        // middleName: 'Middle',
        // city: 'Test city',
        // postOffice: 'Test post office',
        trackingId: '1234556789',
      });
      cy.checkToastMessage('Ваше замовлення');
      cy.getCyEl('order-view-page').should('exist');

      // Check order waybill preview
      cy.getCyEl('order-waybill-view-button').click();
      cy.contains('Товарно-транспортна накладна').should('exist');
      cy.get('.p-dialog-header-close').click();

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
      cy.getCyEl('order-total-amount')
        .invoke('text')
        .then((amount: string) => {
          cy.checkTransaction(amount);
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
        cy.getCyEl('order-status-current').should('contain', 'Нове');
        cy.getCyEl('order-status-edit-button').click();
        cy.selectFromDropdown('order-status-edit-dropdown', 'Опрацьовується');
        cy.getCyEl('order-status-edit-submit').click();
        cy.checkToastMessage('Статус замовлення успішно оновлено');
        cy.getCyEl('order-status-edit-cancel').click(); // close dialog

        // Revert order status
        cy.getCyEl('order-status-edit-button').click();
        cy.selectFromDropdown('order-status-edit-dropdown', 'Нове');
        cy.getCyEl('order-status-edit-submit').click();
        cy.checkToastMessage('Статус замовлення успішно оновлено');
        cy.getCyEl('order-status-edit-cancel').click(); // close dialog

        // Check order waybill preview
        cy.getCyEl('order-waybill-view-button').click();
        cy.contains('Товарно-транспортна накладна').should('exist');
        cy.get('.p-dialog-header-close').click();
      });
    });
  });
});
