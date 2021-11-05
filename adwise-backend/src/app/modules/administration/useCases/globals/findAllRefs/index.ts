import { contactRepo } from "../../../../contacts/repo/contacts";
import { purchaseRepo } from "../../../../finance/repo/purchases";
import { couponRepo } from "../../../../organizations/repo/coupons";
import { invitationRepo } from "../../../../organizations/repo/invitations";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { productRepo } from "../../../../organizations/repo/products";
import { refRepo } from "../../../../ref/repo";
import { userRepo } from "../../../../users/repo/users";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { FindAllRefsController } from "./FindAllRefsController";
import { FindAllRefsUseCase } from "./FindAllRefsUseCase";

export const findAllRefsUseCase = new FindAllRefsUseCase(
    refRepo,
    userRepo,
    couponRepo,
    contactRepo,
    productRepo,
    purchaseRepo,
    invitationRepo,
    organizationRepo,
    administrationValidationService
);
export const findAllRefsController = new FindAllRefsController(findAllRefsUseCase);