describe( 'Products', () => {
  let sku: string, name: string, description: string, size: string, color: string, prize: string, baseProductName: string;

  beforeEach( () => {
    cy.signInAsAdmin();
    cy.openProductCreatePage();
    sku = `SKU-${Date.now()}`;
    name = `Product-${Date.now()}`;
    description = 'Product test description';
    size = '1m';
    color = 'red';
    prize = '100';
    baseProductName = `Base product-${Date.now()}`;
  } );

  it( 'Open product create page', () => {
    cy.get( '[data-cy="product-category-id"]' )
  } );

  it( 'Create product with valid data', () => {
    const categorySelect = 'Віночки і гірлянди';
    const baseProductSelect = 'Вінок різдвяний литий Premium';

    cy.fillProductForm( {
      categorySelect,
      baseProductSelect,
      sku,
      name,
      description,
      size,
      color,
      prize,
    } );

    cy.get( '[data-cy="product-save-button"]' ).click();
    cy.get( '[role="alert"]' ).contains(
      'Продукт успішно створено',
    );
  } );

  it( 'Create product with value duplicate', () => {
    const categoryName = 'Віночки і гірлянди';

    cy.fillProductForm( {
      categoryName,
      baseProductName,
      sku,
      name,
      description,
      size,
      color,
      prize,
    } );

    cy.get( '[data-cy="product-save-button"]' ).click();
    cy.get( '[role="alert"]' ).contains(
      'duplicate key value violates unique constraint',
    );
  } );

  it( 'Create product with new category and base product', () => {
    const categoryName = `Category-${Date.now()}`;

    cy.fillProductForm( {
      categoryName,
      baseProductName,
      sku,
      name,
      description,
      size,
      color,
      prize,
    } );

    cy.get( '[data-cy="product-save-button"]' ).click();
    cy.get( '[role="alert"]' ).contains(
      'Продукт успішно створено',
    );
  } );

  it( 'Create product with new base product', () => {
    const categorySelect = 'Віночки і гірлянди';

    cy.fillProductForm( {
      categorySelect,
      baseProductName,
      sku,
      name,
      description,
      size,
      color,
      prize,
    } );

    cy.get( '[data-cy="product-save-button"]' ).click();
    cy.get( '[role="alert"]' ).contains(
      'Продукт успішно створено',
    );
  } );

} );
