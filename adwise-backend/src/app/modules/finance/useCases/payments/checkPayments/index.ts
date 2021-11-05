import { timeService } from "../../../../../services/timeService";
import { paymentRepo } from "../../../repo/payments";
import { forciblyHandlePaymentStatusUseCase } from "../forciblyHandlePaymentStatus";
import { CheckPaymentsUseCase } from "./CheckPaymentsUseCase";

export const checkPaymentsUseCase = new CheckPaymentsUseCase(paymentRepo, forciblyHandlePaymentStatusUseCase);

timeService.add(checkPaymentsUseCase);