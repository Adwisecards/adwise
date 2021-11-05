import { purchaseRepo } from "../../../../../finance/repo/purchases";
import { organizationRepo } from "../../../../../organizations/repo/organizations";
import { userRepo } from "../../../../repo/users";
import { MeControllerV2 } from "./MeControllerV2";
import { MeUseCaseV2 } from "./MeUseCaseV2";

export const meUseCaseV2 = new MeUseCaseV2(userRepo, organizationRepo, purchaseRepo);
export const meControllerV2 = new MeControllerV2(meUseCaseV2);