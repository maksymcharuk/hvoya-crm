describe('Cart', () => {
  const productListPageUrl = '/dashboard/products';
  const cartPageUrl = '/dashboard/cart';

  describe('Admins', () => {
    describe('Cart widget', () => {
      it('Cart widget is available for users', () => {
        it('Cart widget is not available for super admins', () => {
          cy.signInAsSuperAdmin({ full: true });
          cy.getShoppingCartWidgetMenuButton().should('not.exist');
        });

        it('Cart widget is not available for admins', () => {
          cy.signInAsAdmin({ full: true });
          cy.getShoppingCartWidgetMenuButton().should('not.exist');
        });
      });
    });
  });

  describe('Users', () => {
    const testUserEmail = `user+${Date.now()}@email.com`;
    const testUserPassword = 'Test12345';

    before(() => {
      cy.registerNewUser(testUserEmail, testUserPassword);
      cy.signInAsSuperAdmin();
      cy.confirmUser(testUserEmail);
      cy.logout();
    });

    beforeEach(() => {
      cy.signIn(testUserEmail, testUserPassword, { full: true });
    });

    describe('Cart widget', () => {
      it('Cart widget is available for users', () => {
        cy.getShoppingCartWidgetMenuButton().should('exist');
      });
    });

    describe('Add to cart', () => {
      let productName: string;
      let productPrice: string;
      let productAddToCartButton: Cypress.Chainable;

      beforeEach(() => {
        cy.visit(productListPageUrl);

        productAddToCartButton = cy
          .get('[data-cy="product-add-to-cart-button"]')
          .first();
        cy.get('[data-cy="product-name"]')
          .first()
          .invoke('text')
          .then((text) => (productName = text));
        cy.get('[data-cy="product-price"]')
          .first()
          .invoke('text')
          .then((text) => (productPrice = text));
      });

      it('Adds product to cart from product list page and change number', () => {
        // Cart widget should not have badge
        cy.getShoppingCartWidgetMenuButton()
          .get('.p-badge')
          .should('not.exist');
        // Cart widget should be empty
        cy.openShoppingCartWidget();
        cy.get('app-cart-widget').contains('Cart is empty');

        // Add product to cart
        productAddToCartButton.click();
        cy.get('[role="alert"]').contains(productName);

        // Cart widget should have badge with product count
        cy.getShoppingCartWidgetMenuButton().should('contain', '1');
        // Should be added to cart widget
        cy.openShoppingCartWidget();
        cy.get('[data-cy="cart-widget-item"]').first().contains(productName);

        // Should be added to cart page
        cy.visit(cartPageUrl);
        cy.get('app-cart-item').first().contains(productName);

        // Change product count
        cy.get('p-inputnumber input').first().clear().type('2').blur();

        // Cart widget should have badge with product count
        cy.getShoppingCartWidgetMenuButton().should('contain', '2');

        // Remove all products from cart
        cy.contains('a', 'Remove')
          .should((_) => { })
          .then(($links) => {
            if ($links.length) {
              $links.each((_i, $el) => {
                $el.click();
              });
              return;
            }
          });
        cy.contains('Cart is empty');

        // Cart widget should not have badge
        cy.getShoppingCartWidgetMenuButton()
          .get('.p-badge')
          .should('not.exist');
        // Cart widget should be empty
        cy.openShoppingCartWidget();
        cy.get('app-cart-widget').contains('Cart is empty');
      });
    });
  });
});
