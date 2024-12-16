/* global cy, describe, it, beforeEach */ // declare globals for eslint

import { createStore } from 'vuex';
import BestSellersList from '@/components/lists/BestSellersList.vue';

describe('BestSellersList Component', () => {
    let store;

    beforeEach(() => {
        // Criação do Vuex Store mockado
        store = createStore({
            state: {},
            getters: {
                getBestSellers: () => ({
                    1: {
                        idProduct: 1,
                        name: 'Produto A',
                        price: 100,
                        photo: 'https://www.fujioka.com.br/arquivos/ids/170588-1000-1000/a_227171_alta_1.jpg',
                        category: 'Categoria A'
                    },
                    2: {
                        idProduct: 2,
                        name: 'Produto B',
                        price: 150,
                        photo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg',
                        category: 'Categoria B'
                    }
                })
            },
            actions: {
                saveBestSellers: cy.stub().resolves() // Simula a ação
            }
        });

        // Montagem do componente com a store mockada
        cy.mount(BestSellersList, {
            global: {
                plugins: [store],
                mocks: {
                    $router: {
                        push: cy.stub() // Mock da função de navegação
                    }
                }
            },
            props: {
                showHeader: true
            }
        });

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

        cy.viewport(1280, 720);

        cy.intercept('GET', 'http://localhost:3030/api/transaction/', {
            body: { success: true } 
        }).as('saveBestSellers');
    });

    it('should display the header if showHeader is true', () => {
        cy.get('.list-header h2').should('contain', 'Mais vendidos no Biznes');
    });

    it('should list the best-selling products', () => {
        cy.get('.list-item').should('have.length', 2);
        cy.get('.list-item').eq(0).contains('Produto A');
        cy.get('.list-item').eq(1).contains('Produto B');
    });
});
