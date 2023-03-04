// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
import { signToken } from 'cypress/support/helpers';

// eslint-disable-next-line @typescript-eslint/no-namespace
interface SignInOptions {
  full: boolean;
}
interface Product {
  name?: string;
  price?: string;
}
interface CreateOrderForm {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName: string;
  deliveryType: string;
  city: string;
  postOffice: string;
  trackingId: string;
}
declare global {
  namespace Cypress {
    interface Chainable {
      signIn(
        email: string,
        password: string,
        options?: SignInOptions,
      ): typeof signIn;
      signInAsSuperAdmin(options?: SignInOptions): typeof signInAsSuperAdmin;
      signInAsAdmin(options?: SignInOptions): typeof signInAsAdmin;
      signInAsUser(options?: SignInOptions): typeof signInAsUser;
      signUp(email: string, password: string): typeof signUp;
      resetPassword(password: string, token: string): typeof resetPassword;
      registerNewAdmin(
        email: string,
        password: string,
      ): typeof registerNewAdmin;
      registerNewUser(
        email: string,
        password: string,
        options: any,
      ): typeof registerNewUser;
      logout(): typeof logout;
      openUserMenu(): typeof openUserMenu;
      openProductsMenu(): typeof openProductsMenu;
      openAccountPage(): typeof openAccountPage;
      openProfilePage(): typeof openProfilePage;
      openSettingsPage(): typeof openSettingsPage;
      openProductCreatePage(): typeof openProductCreatePage;
      openProductEditPage(): typeof openProductEditPage;
      selectFromDropdown(
        dropdownId: string,
        value: string,
      ): typeof selectFromDropdown;
      fillProductForm(
        product: any,
        uploadImage?: boolean,
      ): typeof fillProductForm;
      compareProductVariantFields(
        product: any,
      ): typeof compareProductVariantFields;
      compareProductCategoryAndBase(
        testProductCategory: string,
        testProductBase: string,
      ): typeof compareProductCategoryAndBase;
      uploadImageToProduct(): typeof uploadImageToProduct;
      checkImagesAmount(length: number): typeof checkImagesAmount;
      markFirstImageToBeRemoved(): typeof markFirstImageToBeRemoved;
      getShoppingCartWidgetMenuButton(): Cypress.Chainable<JQuery<HTMLElement>>;
      openShoppingCartWidget(): typeof openShoppingCartWidget;
      addProductToCart(productName?: string): Cypress.Chainable<Product>;
      getCyEl(selector: string): Cypress.Chainable<JQuery<HTMLElement>>;
      fillAndSubmitCreateOrderForm(
        data: CreateOrderForm,
      ): typeof fillAndSubmitCreateOrderForm;
      checkToastMessage(message: string): typeof checkToastMessage;
      confirmUser(email: string): typeof confirmUser;
      freezeUser(email: string): typeof freezeUser;
      unFreezeUser(email: string): typeof unFreezeUser;
    }
  }
}

function getCyEl(selector: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get(`[data-cy="${selector}"]`);
}

function signIn(
  email: string,
  password: string,
  options: SignInOptions = { full: false },
): void {
  cy.visit('/');
  cy.get('input[type=email]').type(email);
  cy.get('input[type=password]').type(password);
  cy.get('button[type=submit]').click();
  if (options.full) {
    cy.get('.layout-topbar-logo').should('be.visible');
  }
}

function signInAsSuperAdmin(options?: SignInOptions): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(
        credentials.superAdmin.email,
        credentials.superAdmin.password,
        options,
      );
    });
}

function signInAsAdmin(options?: SignInOptions): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.admin.email, credentials.admin.password, options);
    });
}

function signInAsUser(options?: SignInOptions): void {
  cy.fixture('auth.json')
    .as('authData')
    .then(({ credentials }) => {
      cy.signIn(credentials.user.email, credentials.user.password, options);
    });
}

function signUp(email: string, password: string): void {
  cy.visit('/auth/sign-up');
  cy.getCyEl('email').type(email);
  cy.getCyEl('phone-number').type('1234567890');
  cy.getCyEl('first-name').type('test-firstName');
  cy.getCyEl('middle-name').type('test-middleName');
  cy.getCyEl('last-name').type('test-lastName');
  cy.getCyEl('bio').type('test-bio');
  cy.getCyEl('password').type(password);
  cy.getCyEl('confirm-password').type(password);
  cy.get('button[type=submit]').click();
}

function resetPassword(password: string, token: string): void {
  cy.visit(`/auth/reset-password?token=${token}`);
  cy.get('input[type=password]').first().type(password);
  cy.get('input[type=password]').first().blur();
  cy.get('input[type=password]').last().type(password);
  cy.get('button[type=submit]').click();
}

function openUserMenu(): void {
  cy.get('i.pi-user').click();
}

function openProductsMenu(): void {
  cy.get('i.pi-shopping-cart').click();
}

function logout(): void {
  cy.openUserMenu();
  cy.get('.p-button-label').contains('Вийти').click();
}

function openAccountPage(): void {
  cy.openUserMenu();
  cy.get('.p-button-label').contains('Акаунт').click();
}

function openProfilePage(): void {
  cy.openUserMenu();
  cy.get('li').contains('Профіль').click();
}

function openSettingsPage(): void {
  cy.openAccountPage();
  cy.get('li').contains('Налаштування').click();
}

function openProductCreatePage(): void {
  cy.openProductsMenu();
  cy.get('li').contains('Створити').click();
}

function openProductEditPage(): void {
  cy.openProductsMenu();
  cy.get('li').contains('Редагувати').click();
}

function registerNewUser(email: string, password: string, options: any): void {
  cy.signUp(email, password);
  cy.contains(email);
  cy.contains('Дякуємо за реєстрацію');

  cy.task<any[]>(
    'connectDB',
    'SELECT * FROM public."user" ORDER BY id ASC',
  ).then((users) => {
    const token = signToken(users[users.length - 1].id);

    cy.visit(`/auth/confirm-email?token=${token}`);
  });

  if (options.confirm) {
    cy.task<any[]>(
      'connectDB',
      `UPDATE public."user" 
        SET "userConfirmed" = true
        WHERE id = (SELECT max(id) FROM public."user")`,
    );
  }
}

function registerNewAdmin(email: string, password: string): void {
  cy.registerNewUser(email, password, { confirm: true });
  cy.task<any[]>(
    'connectDB',
    `UPDATE public."user" 
      SET role = 'Admin'::user_role_enum
      WHERE id = (SELECT max(id) FROM public."user")`,
  );
}

function selectFromDropdown(dropdownCyId: string, value: string): void {
  cy.getCyEl(dropdownCyId).click('right');
  cy.get('li[role="option"]').contains(value).click();
}

function fillProductForm(form: any, uploadImage: boolean = true): void {
  if (form.selectedProduct) {
    cy.selectFromDropdown('product-list', form.selectedProduct);
  }

  if (form.categoryName && form.baseProductName) {
    cy.get('[data-cy="new-product-category-toggle"]').click();
    cy.get('[data-cy="product-category-name"]').clear().type(form.categoryName);
    cy.get('[data-cy="product-base-product-name"]')
      .clear()
      .type(form.baseProductName);
  } else if (form.categorySelect && form.baseProductSelect) {
    cy.selectFromDropdown('product-category-id', form.categorySelect);
    cy.selectFromDropdown('product-base-product-id', form.baseProductSelect);
  } else if (form.categorySelect && form.baseProductName) {
    cy.selectFromDropdown('product-category-id', form.categorySelect);
    cy.get('[data-cy="new-base-product-toggle"]').click();
    cy.get('[data-cy="product-base-product-name"]')
      .clear()
      .type(form.baseProductName);
  }

  cy.get('[data-cy="product-sku"]').clear().type(form.sku);
  cy.get('[data-cy="product-name-field"]').clear().type(form.name);
  cy.get('[data-cy="product-description"]')
    .get('div[data-placeholder="Введіть опис для продукту"]')
    .focus()
    .clear()
    .type(form.description);

  cy.selectFromDropdown('product-size', form.size);
  cy.selectFromDropdown('product-color', form.color);

  cy.get('[data-cy="product-prize"] input')
    .type(Cypress._.repeat('{leftArrow}', 5))
    .type(Cypress._.repeat('{del}', 1))
    .type(form.prize);

  if (uploadImage) {
    uploadImageToProduct();
  }
}

function uploadImageToProduct() {
  cy.get('[data-cy="product-image-upload"]')
    .get('div[class="p-fileupload-content"]')
    .selectFile('cypress/files/product.jpeg', { action: 'drag-drop' });
}

function compareProductVariantFields(compareForm: any): void {
  cy.get('[data-cy="product-sku"]').should('have.value', compareForm.sku);
  cy.get('[data-cy="product-name-field"]').should(
    'have.value',
    compareForm.name,
  );
  cy.get('[data-cy="product-description"]')
    .get('div[data-placeholder="Введіть опис для продукту"]')
    .should('have.text', compareForm.description);
  cy.get('[data-cy="product-size"]').should('have.text', compareForm.size);
  cy.get('[data-cy="product-color"]').should('have.text', compareForm.color);
  cy.get('[data-cy="product-prize"] input')
    .invoke('val')
    .then((value) => {
      expect(parseInt(value as string)).to.eq(compareForm.prize);
    });
}

function compareProductCategoryAndBase(
  testProductCategory: string,
  testProductBase: string,
) {
  cy.get('[data-cy="product-category-id"]').should(
    'have.text',
    testProductCategory,
  );
  cy.get('[data-cy="product-base-product-id"]').should(
    'have.text',
    testProductBase,
  );
}

function checkImagesAmount(length: number) {
  cy.get('[data-cy="product-images"]')
    .find('img')
    .should('have.length', length);
}

function markFirstImageToBeRemoved() {
  cy.get('[data-cy="product-images"]')
    .find('[data-cy="product-image-remove"]')
    .first()
    .click();
}

function getShoppingCartWidgetMenuButton() {
  return cy.get('.layout-topbar-button .pi-shopping-cart');
}

function openShoppingCartWidget() {
  cy.getShoppingCartWidgetMenuButton().click();
}

function addProductToCart(productName?: string): Cypress.Chainable<Product> {
  let productData: Product = {};
  cy.visit('/dashboard/products');

  if (productName) {
    cy.contains('app-product-item', productName)
      .find('[data-cy="product-name"]')
      .invoke('text')
      .then((text) => (productData.name = text));
    cy.contains('app-product-item', productName)
      .find('[data-cy="product-price"]')
      .invoke('text')
      .then((text) => (productData.price = text));
    cy.contains('app-product-item', productName)
      .find('[data-cy="product-add-to-cart-button"]')
      .click();
  } else {
    cy.get('app-product-item')
      .first()
      .find('[data-cy="product-name"]')
      .invoke('text')
      .then((text) => (productData.name = text));
    cy.get('app-product-item')
      .first()
      .find('[data-cy="product-price"]')
      .invoke('text')
      .then((text) => (productData.price = text));
    cy.get('app-product-item')
      .first()
      .find('[data-cy="product-add-to-cart-button"]')
      .click();
  }

  return cy.wrap(productData);
}

function fillAndSubmitCreateOrderForm(data: CreateOrderForm): void {
  cy.get('input[id="phone-number"]').clear().type(data.phoneNumber);
  cy.get('input[id="first-name"]').clear().type(data.firstName);
  cy.get('input[id="last-name"]').clear().type(data.lastName);
  cy.get('input[id="middle-name"]').clear().type(data.middleName);
  cy.get('input[id="delivery-type"]').clear().type(data.deliveryType);
  cy.get('input[id="city"]').clear().type(data.city);
  cy.get('input[id="post-office"]').clear().type(data.postOffice);
  cy.get('input[id="tracking-id"]').clear().type(data.trackingId);
  cy.getCyEl('order-submit-button').click();
}

function checkToastMessage(message: string): void {
  cy.get('p-toast').should('contain', message);
}

function confirmUser(email: string): void {
  cy.get('li').contains('Користувачі').click();
  cy.get('input[formcontrolname="search"]').type(email);
  cy.get('td').contains(email).click();
  cy.getCyEl('confirm-user-button').click();
  cy.checkToastMessage('Користувача підтверджено');
}

function freezeUser(email: string): void {
  cy.signInAsSuperAdmin();
  cy.get('li').contains('Користувачі').click();
  cy.get('input[formcontrolname="search"]').type(email);
  cy.get('td').contains(email).click();
  cy.getCyEl('freeze-user-button').click();
  cy.get('button').contains('Так').click();
  cy.checkToastMessage('Акаунт користувача призупинено');
  cy.logout();
}

function unFreezeUser(email: string): void {
  cy.signInAsSuperAdmin();
  cy.get('li').contains('Користувачі').click();
  cy.get('input[formcontrolname="search"]').type(email);
  cy.get('td').contains(email).click();
  cy.getCyEl('unfreeze-user-button').click();
  cy.get('button').contains('Так').click();
  cy.checkToastMessage('Користувача розморожено');
  cy.logout();
}

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("signIn", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getCyEl', getCyEl);
Cypress.Commands.add('signIn', signIn);
Cypress.Commands.add('signInAsSuperAdmin', signInAsSuperAdmin);
Cypress.Commands.add('signInAsAdmin', signInAsAdmin);
Cypress.Commands.add('signInAsUser', signInAsUser);
Cypress.Commands.add('signUp', signUp);
Cypress.Commands.add('resetPassword', resetPassword);
Cypress.Commands.add('registerNewAdmin', registerNewAdmin);
Cypress.Commands.add('registerNewUser', registerNewUser);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('openUserMenu', openUserMenu);
Cypress.Commands.add('openProductsMenu', openProductsMenu);
Cypress.Commands.add('openAccountPage', openAccountPage);
Cypress.Commands.add('openProfilePage', openProfilePage);
Cypress.Commands.add('openSettingsPage', openSettingsPage);
Cypress.Commands.add('openProductCreatePage', openProductCreatePage);
Cypress.Commands.add('openProductEditPage', openProductEditPage);
Cypress.Commands.add('selectFromDropdown', selectFromDropdown);
Cypress.Commands.add('fillProductForm', fillProductForm);
Cypress.Commands.add(
  'compareProductVariantFields',
  compareProductVariantFields,
);
Cypress.Commands.add(
  'compareProductCategoryAndBase',
  compareProductCategoryAndBase,
);
Cypress.Commands.add('uploadImageToProduct', uploadImageToProduct);
Cypress.Commands.add('checkImagesAmount', checkImagesAmount);
Cypress.Commands.add('markFirstImageToBeRemoved', markFirstImageToBeRemoved);
Cypress.Commands.add(
  'getShoppingCartWidgetMenuButton',
  getShoppingCartWidgetMenuButton,
);
Cypress.Commands.add('openShoppingCartWidget', openShoppingCartWidget);
Cypress.Commands.add('addProductToCart', addProductToCart);
Cypress.Commands.add(
  'fillAndSubmitCreateOrderForm',
  fillAndSubmitCreateOrderForm,
);
Cypress.Commands.add('checkToastMessage', checkToastMessage);
Cypress.Commands.add('confirmUser', confirmUser);
Cypress.Commands.add('freezeUser', freezeUser);
Cypress.Commands.add('unFreezeUser', unFreezeUser);
