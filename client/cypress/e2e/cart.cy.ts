describe('Cart', () => {
  const productListPageUrl = '/dashboard/products';
  const cartPageUrl = '/dashboard/cart';

  function getShoppingCartWidget(): Cypress.Chainable {
    return cy.get('.layout-topbar-button .pi-shopping-cart');
  }

  function openShoppingCartWidget() {
    getShoppingCartWidget().click();
  }

  describe('Admins', () => {
    describe('Cart widget', () => {
      it('Cart widget is available for users', () => {
        it('Cart widget is not available for super admins', () => {
          cy.signInAsSuperAdmin({ full: true });
          getShoppingCartWidget().should('not.exist');
        });

        it('Cart widget is not available for admins', () => {
          cy.signInAsAdmin({ full: true });
          getShoppingCartWidget().should('not.exist');
        });
      });
    });
  });

  describe('Users', () => {
    const testUserEmail = `user+${Date.now()}@email.com`;
    const testUserPassword = 'Test12345';

    before(() => {
      cy.registerNewUser(testUserEmail, testUserPassword);
    });

    beforeEach(() => {
      cy.signIn(testUserEmail, testUserPassword, { full: true });
    });

    describe('Cart widget', () => {
      it('Cart widget is available for users', () => {
        getShoppingCartWidget().should('exist');
      });
    });

    describe('Add to cart', () => {
      let product: Cypress.Chainable;
      let productName: string;
      let productPrice: string;
      let productAddToCartButton: Cypress.Chainable;

      beforeEach(() => {
        cy.visit(productListPageUrl);

        product = cy.get('app-product-item').first();
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
        getShoppingCartWidget().get('.p-badge').should('not.exist');
        // Cart widget should be empty
        openShoppingCartWidget();
        cy.get('app-cart-widget').contains('Cart is empty');

        // Add product to cart
        productAddToCartButton.click();
        cy.get('[role="alert"]').contains(productName);

        // Cart widget should have badge with product count
        getShoppingCartWidget().should('contain', '1');
        // Should be added to cart widget
        openShoppingCartWidget();
        cy.get('[data-cy="cart-widget-item"]').first().contains(productName);

        // Should be added to cart page
        cy.visit(cartPageUrl);
        cy.get('app-cart-item').first().contains(productName);

        // Change product count
        cy.get('p-inputnumber input').first().clear().type('2').blur();

        // Cart widget should have badge with product count
        getShoppingCartWidget().should('contain', '2');

        // Remove all products from cart
        cy.contains('a', 'Remove')
          .should((_) => {})
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
        getShoppingCartWidget().get('.p-badge').should('not.exist');
        // Cart widget should be empty
        openShoppingCartWidget();
        cy.get('app-cart-widget').contains('Cart is empty');
      });
    });
  });
});
