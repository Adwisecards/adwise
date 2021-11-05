import { globalRepo } from "../../../../administration/repo/globals";
import { accumulationRepo } from "../../../repo/accumulations";
import { paymentRepo } from "../../../repo/payments";
import { accumulationValidationService } from "../../../services/accumulations/accumulationValidationService";
import { AccumulatePaymentUseCase } from "./AccumulatePaymentUseCase";

export const accumulatePaymentUseCase = new AccumulatePaymentUseCase(
    globalRepo,
    paymentRepo,
    accumulationRepo, 
    accumulationValidationService
);