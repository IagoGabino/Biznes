<template>
    <div class="sale-modal" data-testid="sale-modal">
        <ModalComponent :modalOpen="modalOpen" @closeModal="closeModal">
            <h2 data-testid="sale-id">
                Pedido Nº: {{ sale.id }}
            </h2>

            <div class="sale-details" data-testid="sale-details">
                <div class="sale-info" data-testid="sale-info">
                    <div class="left" data-testid="sale-info-left">
                        <h2 data-testid="sale-date">Data: <span>{{ formatDate(sale.date) }}</span></h2>
                        <h2 data-testid="sale-delivery-date">Entrega Prevista: <span>{{ formatDate(sale.deliveryDate) }}</span></h2>
                        <h2 data-testid="sale-payment-method">Forma de Pagamento: <span>{{ sale.paymentMethod }}</span></h2>
                    </div>
                    <div class="right" data-testid="sale-info-right">
                        <h2>Endereço de entrega</h2>
                        <span data-testid="delivery-address">
                            {{ sale.recipientName }} <br>
                            {{ sale.Address?.street }}, {{ sale.Address?.number }} - {{ sale.Address?.complement }} -
                            {{ sale.Address?.neighborhood }}, 
                            {{ sale.Address?.city }} - {{ sale.Address?.state }} <br>
                            {{ sale.Address?.cep }}
                        </span>
                    </div>
                </div>

                <div class="items" data-testid="sale-items">
                    <h1>Itens do pedido</h1>
                    <div class="sale-list" data-testid="sale-list">
                        <div class="sale-list-header" data-testid="sale-list-header">
                            <div class="header-item" v-for="(field, fkey) in listFields" :key="fkey" data-testid="sale-list-header-item">
                                <h2>{{ field }}</h2>
                            </div>
                        </div>
                        <div class="sale-products" data-testid="sale-products">
                            <div class="sale-prod" v-for="(prod, pkey) in productsList" :key="pkey" data-testid="sale-prod">
                                <div class="prod-info" data-testid="prod-info">
                                    <img :src="prod.photo" alt="product" data-testid="product-photo">
                                    <h2 data-testid="product-name">{{ prod.name }}</h2>
                                </div>
                                <h2 data-testid="product-quantity">{{ prod.quantity }}</h2>
                                <h2 data-testid="product-total">{{ formatValue(getProductTotal(prod.price, prod)) }}</h2>
                                <h2 data-testid="product-option">
                                    <template v-if="prod.option">
                                        {{ prod.option }}
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sale-total" data-testid="sale-total">
                    <h2>Total: {{ formatValue(sale.total) }}</h2>
                </div>
            </div>
        </ModalComponent>
        
    </div>
</template>

<script>
import ModalComponent from '../ModalComponent.vue'
import moment from 'moment'

export default {
    name: 'SaleModal',
    components: {
        ModalComponent
    },
    props: ['modalOpen', 'sale'],
    data() {
        return {
            productsList: [],
            listFields: ['Produto', 'Quantidade', 'Total', 'Opções']
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal')
        },
        getProductTotal(price, product) {
            return price * product.quantity
        },
        formatValue(value) {
            if (value)
                return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        },
        formatDate(date) {
            return moment(date).format("DD/MM/YYYY")
        },
    },
    computed: {
    },
    mounted() {
        this.productsList = this.sale.TransactionProducts?.map((prod) => {
            console.log(prod)
            return {
                photo: prod.productPhoto,
                name: prod.productName,
                quantity: prod.quantity,
                price: prod.price,
                option: prod.option
            }
        })
    },
    watch: {
        modalOpen() {
            if (this.modalOpen) {
                this.productsList = this.sale.TransactionProducts.map((prod) => {
                    return {
                        photo: prod.productPhoto,
                        name: prod.productName,
                        quantity: prod.quantity,
                        price: prod.price,
                        option: prod.selectedOption
                    }
                })
            }
        }
    }
    
}
</script>

<style lang="less">
.sale-modal {   
    h2 {
        font-size: 18px;
        font-weight: 500;
    }

    span {
        font-weight: 400;
        color: #858586;
    }

    .sale-details {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .sale-info {
            display: flex;
            flex-direction: row;
            text-align: left;
            justify-content: space-evenly;
            gap: 20px;

            .left {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
            }

            .right {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                max-width: 350px;
                word-break: break-word;
                text-align: right;

                span {
                    font-size: 18px;
                }
            }
        }
    }

    .items {
        display: flex;
        flex-direction: column;
        margin-top: 30px;
        width: 100%;
        max-width: 800px;

        h1 {
            font-size: 22px;
            font-weight: 500;
            margin-bottom: 20px;
            text-align: left;
            align-self: flex-start;
        }

        .sale-list {
            width: 100%;
            display: flex;
            flex-direction: column;
            max-height: 300px;
            overflow-y: auto;

            .sale-list-header {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                align-items: center;
                padding: 10px;

                h2 {
                    text-align: center;
                    font-size: 18px;
                    font-weight: 500;
                }
            }

            .sale-products {
                display: flex;
                flex-direction: column;

                .sale-prod {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                    text-align: center;
                    margin-bottom: 20px;

                    .prod-info {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        img {
                            width: 70px;
                            height: 70px;
                            display: flex;
                            object-fit: contain;
                            margin-right: 10px;
                        }
                    }


                    h2 {
                        font-size: 16px;
                        font-weight: 500;
                        text-align: center;
                    }
                }
            }
        }
    }

    .sale-total {
        display: flex;
        flex-direction: row;
        align-self: flex-end;
        margin-right: 15px;

        h2 {
            font-size: 24px;
            font-weight: 500;
        }
    }
}
</style>