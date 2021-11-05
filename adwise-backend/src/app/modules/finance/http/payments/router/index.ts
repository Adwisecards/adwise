import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { confirmCashPaymentController } from "../../../useCases/payments/confirmCashPayment";
import { handlePaymentStatusController } from "../../../useCases/payments/handlePaymentStatus";
import '../../../useCases/payments/resendNotifications';
import '../../../useCases/payments/checkPayments';
import { forciblyHandlePaymentStatusController } from "../../../useCases/payments/forciblyHandlePaymentStatus";

const paymentRouter = Router();

paymentRouter.post('/handle-payment-status', (req, res) => handlePaymentStatusController.execute(req, res));
paymentRouter.get('/handle-payment-status', (_, res) => res.send('OK'));
paymentRouter.use('/handle-payment-status', (_, res) => res.send('OK'));

paymentRouter.use('/confirm-cash-payment/:id', applyBlock, applyAuth, (req, res) => confirmCashPaymentController.execute(req, res));
paymentRouter.get('/forcibly-handle-payment-status/:id', applyBlock, applyAuth, (req, res) => forciblyHandlePaymentStatusController.execute(req, res));


export {
    paymentRouter
};

/*
[
    {   
        "name": "Confirm cash payment",
        "path": "/finance/confirm-cash-payment/{id}",
        "dto": "src/app/modules/finance/useCases/payments/confirmCashPayment/ConfirmCashPaymentDTO.ts",
        "errors": "src/app/modules/finance/useCases/payments/confirmCashPayment/confirmCashPaymentErrors.ts",
        "method": "POST",
        "description": "Подтверждает платеж."
    }
]
*/