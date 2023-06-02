describe('Cart', () => {
  const productListPageUrl = '/dashboard/products';
  const cartPageUrl = '/dashboard/cart';

  describe('Admins', () => {
    describe('Cart widget', () => {
      it('Is not available for super admins', () => {
        cy.signInAsSuperAdmin({ full: true });
        cy.getShoppingCartWidgetMenuButton().should('not.exist');
      });

      it('Is not available for admins', () => {
        cy.signInAsAdmin({ full: true });
        cy.getShoppingCartWidgetMenuButton().should('not.exist');
      });
    });
  });

  describe('Users', () => {
    const testUserEmail = `user+${Date.now()}@email.com`;
    const testUserPassword = 'Test12345';

    before(() => {
      cy.registerNewUser(testUserEmail, testUserPassword, { confirm: true });
    });

    beforeEach(() => {
      cy.signIn(testUserEmail, testUserPassword, { full: true });
    });

    describe('Cart widget', () => {
      it('Is available for users', () => {
        cy.getShoppingCartWidgetMenuButton().should('exist');
      });
    });

    describe('Add to cart', () => {
      let productName: string;

      beforeEach(() => {
        cy.visit(productListPageUrl);

        cy.get('[data-cy="product-item"]')
          .contains(
            '[data-cy="product-add-to-cart-button"]:not(:disabled)',
            'Додати в кошик',
          )
          .as('productAddToCartButton')
          .parent()
          .then(($el) => {
            productName = $el.find('[data-cy="product-name"]').text();
          });
      });

      it('Adds product to cart from product list page and change number', () => {
        // Cart widget should not have badge
        cy.getShoppingCartWidgetMenuButton()
          .get('.p-badge')
          .should('not.exist');
        // Cart widget should be empty
        cy.openShoppingCartWidget();
        cy.get('app-cart-widget').contains('Кошик пустий');

        // Add product to cart
        cy.get('@productAddToCartButton').click();
        cy.checkToastMessage(productName.trim());

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
        cy.contains('a', 'Видалити')
          .should((_) => {})
          .then(($links) => {
            if ($links.length) {
              $links.each((_i, $el) => {
                $el.click();
              });
              return;
            }
          });
        cy.contains('Кошик пустий');

        // Cart widget should not have badge
        cy.getShoppingCartWidgetMenuButton()
          .get('.p-badge')
          .should('not.exist');
        // Cart widget should be empty
        cy.openShoppingCartWidget();
        cy.get('app-cart-widget').contains('Кошик пустий');
      });
    });
  });
});
