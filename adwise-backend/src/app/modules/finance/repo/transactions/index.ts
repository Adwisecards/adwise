import { TransactionModel } from "../../models/Transaction";
import { TransactionRepo } from "./implementation/TransactionRepo";

const transactionRepo = new TransactionRepo(TransactionModel);

export {
    transactionRepo
};