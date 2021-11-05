import { paymentService } from "../../../../../services/paymentService";
import { paymentRepo } from "../../../repo/payments";
import { handlePaymentStatusUseCase } from "../handlePaymentStatus";
import { ForciblyHandlePaymentStatusController } from "./ForciblyHandlePaymentStatusController";
import { ForciblyHandlePaymentStatusUseCase } from "./ForciblyHandlePaymentStatusUseCase";

export const forciblyHandlePaymentStatusUseCase = new ForciblyHandlePaymentStatusUseCase(paymentRepo, paymentService, handlePaymentStatusUseCase);
export const forciblyHandlePaymentStatusController = new ForciblyHandlePaymentStatusController(forciblyHandlePaymentStatusUseCase);