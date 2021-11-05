import { purchaseRepo } from "../../../../finance/repo/purchases";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../repo/users";
import { MeController } from "./MeController";
import { MeUseCase } from "./MeUseCase";
import { meUseCaseV2 } from "./v2";
import { MeUseCaseV2 } from "./v2/MeUseCaseV2";

const meUseCase = new MeUseCaseV2(userRepo, organizationRepo, purchaseRepo);
const meController = new MeController(meUseCaseV2 as any);

export {
    meUseCase,
    meController
};