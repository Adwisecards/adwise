import { Router } from "express";
import { applyAdmin, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { changeCurrencyController } from "../../../useCases/wallets/changeCurrency";
import { depositWalletController } from "../../../useCases/wallets/depositWallet";
import { payDepositWalletController } from "../../../useCases/wallets/payDepositWallet";
import '../../../useCases/wallets/unfreezePoints';
import '../../../useCases/wallets/recalculateWalletBalance';
import '../../../useCases/wallets/checkDeposit';
import { correctBalanceController } from "../../../useCases/wallets/correctBalance";
import { getWalletController } from "../../../useCases/wallets/getWallet";
import { getWalletBalanceController } from "../../../useCases/wallets/getWalletBalance";
import { setWalletDepositController } from "../../../useCases/wallets/setWalletDeposit";

const walletRouter = Router();

walletRouter.put('/change-wallet-currency', applyBlock, applyAuth, (req, res) => changeCurrencyController.execute(req, res));
walletRouter.put('/deposit-wallet/:id', applyBlock, applyAuth, (req, res) => depositWalletController.execute(req, res));
walletRouter.post('/pay-deposit-wallet', applyBlock, applyAuth, (req, res) => payDepositWalletController.execute(req, res));
walletRouter.put('/correct-balance/:id', applyAdmin, (req, res) => correctBalanceController.execute(req, res));
walletRouter.get('/get-wallet', applyBlock, applyAuth, (req, res) => getWalletController.execute(req, res));
walletRouter.get('/get-wallet-balance/:id', applyBlock, applyAuth, (req, res) => getWalletBalanceController.execute(req, res));
walletRouter.post('/set-wallet-deposit/:id', applyBlock, applyAuth, (req, res) => setWalletDepositController.execute(req, res));

export {
    walletRouter
};

/*
[
    {   
        "name": "change wallet currency",
        "path": "/finance/change-wallet-currency",
        "dto": "src/app/modules/finance/useCases/wallets/changeCurrency/ChangeCurrencyDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/changeCurrency/changeCurrencyErrors.ts",
        "method": "PUT",
        "tags": ["administration"],
        "description": "Меняет валюту кошелька пользователя и если организация привязана к пользователю, также меняет валюту организации."
    },
    {   
        "name": "deposit wallet",
        "path": "/finance/deposit-wallet/{id}",
        "dto": "src/app/modules/finance/useCases/wallets/depositWallet/DepositWalletDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/depositWallet/depositWalletErrors.ts",
        "method": "PUT",
        "tags": ["administration"],
        "description": "Метод для пополнения баланса кошелька."
    },
    {   
        "name": "correct balance",
        "path": "/finance/correct-balance/{id}",
        "dto": "src/app/modules/finance/useCases/wallets/correctBalance/CorrectBalanceDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/correctBalance/correctBalanceErrors.ts",
        "method": "PUT",
        "tags": ["administration"],
        "description": "Корректирует баланс."
    },
    {   
        "name": "pay deposit wallet",
        "path": "/finance/pay-deposit-wallet",
        "dto": "src/app/modules/finance/useCases/wallets/payDepositWallet/PayDepositWalletDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/payDepositWallet/payDepositWalletErrors.ts",
        "method": "POST",
        "tags": ["administration"],
        "description": "Метод для пополнения баланса кошелька."
    },
    {   
        "name": "get wallet",
        "path": "/finance/get-wallet?organization={1}",
        "dto": "src/app/modules/finance/useCases/wallets/getWallet/GetWalletDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/getWallet/getWalletErrors.ts",
        "method": "GET",
        "description": "Метод для получения кошелька."
    },
    {   
        "name": "get wallet balance",
        "path": "/finance/get-wallet-balance/{id}",
        "dto": "src/app/modules/finance/useCases/wallets/getWalletBalance/GetWalletBalanceDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/getWalletBalance/getWalletBalanceErrors.ts",
        "method": "GET",
        "description": "Метод для получения баланса кошелька."
    },
    {   
        "name": "set wallet deposit",
        "path": "/finance/set-wallet-deposit/{id}",
        "dto": "src/app/modules/finance/useCases/wallets/setWalletDeposit/SetWalletDepositDTO.ts",
        "errors": "src/app/modules/finance/useCases/wallets/setWalletDeposit/setWalletDepositErrors.ts",
        "method": "POST",
        "description": "Метод для установки депозита организации (для наличных платежей)."
    }
]
*/