/* global cy, describe, it, beforeEach */ // declare globals for eslint

import ProductCard from '../../src/components/products/ProductCard.vue';

describe('ProductCard Component', () => {
  const productMock = {
    photo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg',
    name: 'Test Product Name That Is Too Long',
    category: 'Category1,Category2',
    price: 1234.56,
  };
  
  beforeEach(() => {
    cy.document().then((doc) => {
        const style = doc.createElement('style');
        style.innerHTML = `
            :root {
                --primaryColor: #57A06F; /* Cor desejada */
                font-family: 'Roboto', sans-serif;
            }
        `;
        doc.head.appendChild(style);
    });
    });

  it('renders correctly with product data', () => {      
    cy.mount(ProductCard, {
      props: {
        product: productMock,
        fixSize: true,
      },
    });

    // Verifica se o nome foi encurtado
    cy.get('[data-testid="name"]').should('have.text', 'Test Product Name That Is...');

    // Verifica as categorias
    cy.get('.category').should('have.length', 2);
    cy.get('.category').eq(0).should('contain', 'Category1');
    cy.get('.category').eq(1).should('contain', 'Category2');

    // Verifica o preço formatado
    cy.get('.price').should('contain', 'R$ 1.234,56');
    cy.pause();
  });

  it('renders without fixed size', () => {
    cy.mount(ProductCard, {
      props: {
        product: productMock,
        fixSize: false,
      },
    });

    cy.get('.product-card').should('not.have.class', 'fixedSize');
    cy.get('.name').should('not.contain', '...');
  });
});
