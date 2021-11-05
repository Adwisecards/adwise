import { VerificationModel } from "../../models/Verification";
import { VerificationRepo } from "./implementation/VerificationRepo";

const verificationRepo = new VerificationRepo(VerificationModel);

export {
    verificationRepo
};