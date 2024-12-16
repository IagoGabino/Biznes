/* global cy, describe, it, beforeEach */ // Declaração de globais para eslint
import SaleModal from '@/components/modals/vendor/SaleModal.vue';
import moment from 'moment'

describe('SaleModal Component', () => {
    const saleMock = {
        id: 12345,
        date: '2024-12-10',
        deliveryDate: '2024-12-20',
        paymentMethod: 'Cartão de Crédito',
        recipientName: 'João da Silva',
        Address: {
            street: 'Rua Exemplo',
            number: '123',
            complement: 'Apt 101',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            cep: '12345-678',
        },
        total: 350,
        TransactionProducts: [
            {
                productPhoto: 'https://www.fujioka.com.br/arquivos/ids/170588-1000-1000/a_227171_alta_1.jpg',
                productName: 'Produto A',
                quantity: 2,
                price: 100,
                option: 'Tamanho G',
            },
            {
                productPhoto: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg',
                productName: 'Produto B',
                quantity: 1,
                price: 150,
                option: 'Cor Vermelha',
            },
        ],
    };

    beforeEach(() => {
        cy.mount(SaleModal, {
            props: {
                modalOpen: true,
                sale: saleMock,
            },
        });

        cy.viewport(1200, 800);

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

    it('should display the sale details correctly', () => {
        // Verifica cabeçalho do modal
        cy.get('[data-testid="sale-id"]').contains(`Pedido Nº: ${saleMock.id}`).should('exist');

        // Verifica detalhes da compra
        cy.get('[data-testid="sale-info-left"] [data-testid="sale-date"]').contains(`Data: ${moment(saleMock.date).format('DD/MM/YYYY')}`);
        cy.get('[data-testid="sale-info-left"] [data-testid="sale-delivery-date"]').contains(`Entrega Prevista: ${moment(saleMock.deliveryDate).format('DD/MM/YYYY')}`);
        cy.get('[data-testid="sale-info-left"] [data-testid="sale-payment-method"]').contains(`Forma de Pagamento: ${saleMock.paymentMethod}`);

        // Verifica endereço
        cy.get('[data-testid="sale-info-right"] [data-testid="delivery-address"]').contains(saleMock.recipientName).should('exist');
        cy.get('[data-testid="sale-info-right"] [data-testid="delivery-address"]').contains(saleMock.Address.street).should('exist');
        cy.get('[data-testid="sale-info-right"] [data-testid="delivery-address"]').contains(saleMock.Address.cep).should('exist');
    });

    it('should display the product list correctly', () => {
        cy.get('[data-testid="sale-products"] [data-testid="sale-prod"]').should('have.length', saleMock.TransactionProducts.length);

        saleMock.TransactionProducts.forEach((product, index) => {
            cy.get('[data-testid="sale-products"] [data-testid="sale-prod"]')
                .eq(index)
                .within(() => {
                    let total = product.price * product.quantity;
                    cy.get('[data-testid="prod-info"] [data-testid="product-photo"]').should('have.attr', 'src', product.productPhoto);
                    cy.get('[data-testid="prod-info"] [data-testid="product-name"]').contains(product.productName).should('exist');
                    cy.get('[data-testid="product-quantity"]').contains(product.quantity).should('exist');
                    cy.get('[data-testid="product-total"]').contains(total).should('exist');
                    cy.get('[data-testid="product-option"]').contains(product.option).should('exist');
                });
        });
    });

    it('should format the total value correctly', () => {
        cy.get('[data-testid="sale-total"] h2').contains(saleMock.total).should('exist');
        cy.pause();
    });

    it('expect error: should format the total value correctly', () => {
        cy.get('[data-testid="sale-total"] h2').contains(saleMock.total).should('not.exist');
    });
});
