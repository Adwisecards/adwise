import { Router } from "express";
import { handleBankRequestController } from "../../../useCases/bankRequests/handleBankRequest";

export const bankRequestRouter = Router();

bankRequestRouter.post('/handle-bank-request', (req, res) => handleBankRequestController.execute(req, res));
bankRequestRouter.get('/handle-bank-request', (req, res) => handleBankRequestController.execute(req, res));
bankRequestRouter.use('/handle-bank-request', (req, res) => handleBankRequestController.execute(req, res));