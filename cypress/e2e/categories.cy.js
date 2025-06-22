describe('Categories Page', () => {
  beforeEach(() => {
    cy.visit('/category.html');
    cy.wait(1000);
  });

  it('loads categories successfully', () => {
    cy.get('#category-container').should('exist');
    cy.get('#category-container .card').should('have.length.greaterThan', 0);
  });

  it('has working pagination', () => {
    cy.get('#next-page').click();
    cy.get('#current-page').should('have.value', '2');
    cy.get('#prev-page').click();
    cy.get('#current