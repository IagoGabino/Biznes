import { Transaction } from "../models/Transaction";
import { TransactionInterface } from "../models/Transaction";
import { TransactionProduct } from "../../transactionProduct/models/TransactionProduct";
import { TransactionProductInterface } from "../../transactionProduct/models/TransactionProduct";
import { TransactionRepository } from "../repository/TransactionRepository";


export class SequelizeTransactionRepository implements TransactionRepository{

    async create(transaction: TransactionInterface, transactionProducts: TransactionProductInterface[]): Promise<TransactionInterface> {
        try{
            const transactionCreated = await Transaction.create(transaction);
            transactionProducts.forEach(async (transactionProduct) => {
                transactionProduct.idTransaction = transactionCreated.idTransaction;
                console.log(transactionProduct);
                await TransactionProduct.create(transactionProduct);
            });
            return transactionCreated;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<TransactionInterface[]> {
        return await Transaction.findAll({include: [TransactionProduct]});
    }

    async getById(id: string): Promise<TransactionInterface | null> {
        return await Transaction.findByPk(id);
    }

    async delete(id: string): Promise<void> {
        await Transaction.destroy({where: {idTransaction: id}});
    }

    async getByUserId(id: string): Promise<TransactionInterface[]> {
        return await Transaction.findAll({where: {idUser: id}});
    }

}