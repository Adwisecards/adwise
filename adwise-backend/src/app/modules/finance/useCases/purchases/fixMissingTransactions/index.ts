import { globalRepo } from "../../../../administration/repo/globals";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { createTransactionUseCase } from "../../transactions/createTransaction";
import { FixMissingTransactionsUseCase } from "./FixMissingTransactionsUseCase";

const fixMissingTransactionsUseCase = new FixMissingTransactionsUseCase(createTransactionUseCase, purchaseRepo, transactionRepo, globalRepo, organizationRepo, userRepo);

export {
    fixMissingTransactionsUseCase
};