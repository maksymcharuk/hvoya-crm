describe('Products', () => {
  let sku: string,
    name: string,
    description: string,
    size: string,
    color: string,
    prize: number,
    baseProductName: string;
  let testProductName: string = `Product-${Date.now()}`;
  let testProductBase: string;
  let testProductCategory: string;

  beforeEach(() => {
    cy.signInAsAdmin();
    sku = `SKU-${Date.now()}`;
    name = `Product-${Date.now()}`;
    description = 'Product test description';
    size = '1m';
    color = 'red';
    prize = 1;
    baseProductName = `Base product-${Date.now()}`;
  });

  describe('Create', () => {
    beforeEach(() => {
      cy.openProductCreatePage();
    });

    it('Open product create page', () => {
      cy.get('[data-cy="product-category-id"]');
    });

    it('Create product with valid data', () => {
      const categorySelect = 'Віночки і гірлянди';
      const baseProductSelect = 'Вінок різдвяний литий Premium';

      cy.fillProductForm({
        categorySelect,
        baseProductSelect,
        sku,
        name: testProductName,
        description,
        size,
        color,
        prize,
      });

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно створено');
    });

    it('Create product with value duplicate', () => {
      const categoryName = 'Віночки і гірлянди';

      cy.fillProductForm({
        categoryName,
        baseProductName,
        sku,
        name,
        description,
        size,
        color,
        prize,
      });

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('duplicate key value violates unique constraint');
    });

    it('Create product with new category and base product', () => {
      const categoryName = `Category-${Date.now()}`;
      testProductCategory = categoryName;
      testProductBase = baseProductName;

      cy.fillProductForm({
        categoryName,
        baseProductName,
        sku,
        name,
        description,
        size,
        color,
        prize,
      });

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно створено');
    });

    it('Create product with new base product', () => {
      const categorySelect = 'Віночки і гірлянди';

      cy.fillProductForm({
        categorySelect,
        baseProductName,
        sku,
        name,
        description,
        size,
        color,
        prize,
      });

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно створено');
    });
  });

  describe('Edit', () => {
    beforeEach(() => {
      cy.openProductEditPage();
    });

    it('Open product edit page', () => {
      cy.get('[data-cy="product-category-id"]');
    });

    it('Edit product variant data', () => {
      cy.fillProductForm(
        {
          selectedProduct: testProductName,
          sku,
          name: testProductName,
          description,
          size,
          color,
          prize,
        },
        false,
      );

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно змінено');
      cy.getCyEl('product-view-page').should('exist');

      cy.go('back');
      cy.reload();
      cy.selectFromDropdown('product-list', testProductName);
      cy.compareProductVariantFields({
        sku,
        name: testProductName,
        description,
        size,
        color,
        prize,
      });
    });

    it('Edit product category and base', () => {
      cy.fillProductForm(
        {
          selectedProduct: testProductName,
          categorySelect: testProductCategory,
          baseProductSelect: testProductBase,
          sku,
          name: testProductName,
          description,
          size,
          color,
          prize,
        },
        false,
      );

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно змінено');
      cy.getCyEl('product-view-page').should('exist');

      cy.go('back');
      cy.reload();
      cy.selectFromDropdown('product-list', testProductName);
      cy.compareProductCategoryAndBase(testProductCategory, testProductBase);
    });

    it('Add image to product', () => {
      cy.selectFromDropdown('product-list', testProductName);
      cy.uploadImageToProduct();

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно змінено');
      cy.getCyEl('product-view-page').should('exist');

      cy.go('back');
      cy.reload();
      cy.selectFromDropdown('product-list', testProductName);
      cy.checkImagesAmount(2);
    });

    it('Remove existing image from product', () => {
      cy.selectFromDropdown('product-list', testProductName);
      cy.markFirstImageToBeRemoved();

      cy.get('[data-cy="product-save-button"]').click();
      cy.checkToastMessage('Продукт успішно змінено');
      cy.getCyEl('product-view-page').should('exist');

      cy.go('back');
      cy.reload();
      cy.selectFromDropdown('product-list', testProductName);
      cy.checkImagesAmount(1);
    });
  });
});
