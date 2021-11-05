import { Router } from "express";
import { applyAdmin, applyAdminGuest, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { addCommentToTransactionController } from "../../../useCases/transactions/AddCommentToTransaction";
import { createTransactionController } from "../../../useCases/transactions/createTransaction";
import { disableTransactionController } from "../../../useCases/transactions/disableTransaction";
import { getAllWalletTransactionsController } from "../../../useCases/transactions/getAllWalletTransactionsSum";
import '../../../useCases/transactions/unfreezeTransactions';

const transactionRouter = Router();

transactionRouter.get('/get-wallet-transactions-sum/:id', applyBlock, (req, res) => getAllWalletTransactionsController.execute(req, res));
transactionRouter.put('/set-transaction-disabled/:id', applyAdminGuest, (req, res) => disableTransactionController.execute(req, res));
transactionRouter.post('/create-transaction', applyAdminGuest, (req, res) => createTransactionController.execute(req, res));
transactionRouter.put('/add-comment-to-transaction/:id', applyAdminGuest, (req, res) => addCommentToTransactionController.execute(req, res));

export {
    transactionRouter
};

/*
[
    {   
        "name": "set transaction disabled",
        "path": "/finance/set-transaction-disabled/:id",
        "dto": "src/app/modules/finance/useCases/transactions/disableTransaction/DisableTransactionDTO.ts",
        "errors": "src/app/modules/finance/useCases/transactions/disableTransaction/disableTransactionErrors.ts",
        "method": "PUT",
        "description": "Отключает транзакцию."
    },
    {   
        "name": "add comment to transaction",
        "path": "/finance/add-comment-to-transaction/:id",
        "dto": "src/app/modules/finance/useCases/transactions/addCommentToTransaction/AddCommentToTransactionDTO.ts",
        "errors": "src/app/modules/finance/useCases/transactions/addCommentToTransaction/addCommentToTransactionErrors.ts",
        "method": "PUT",
        "description": "Добавляет комментарий к транзакции."
    }
]
*/