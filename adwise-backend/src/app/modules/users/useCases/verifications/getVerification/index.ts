import { verificationRepo } from "../../../repo/verifications";
import { GetVerificationController } from "./GetVerificationController";
import { GetVerificationUseCase } from "./GetVerificationUseCase";

const getVerificationUseCase = new GetVerificationUseCase(verificationRepo);
const getVerificationController = new GetVerificationController(getVerificationUseCase);

export {
    getVerificationUseCase,
    getVerificationController
};