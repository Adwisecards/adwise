import { contactRepo } from "../../../contacts/repo/contacts";
import { purchaseRepo } from "../../../finance/repo/purchases";
import { subscriptionRepo } from "../../../finance/repo/subscriptions";
import { couponRepo } from "../../../organizations/repo/coupons";
import { invitationRepo } from "../../../organizations/repo/invitations";
import { organizationRepo } from "../../../organizations/repo/organizations";
import { productRepo } from "../../../organizations/repo/products";
import { userRepo } from "../../../users/repo/users";
import { refRepo } from "../../repo";
import { createRefUseCase } from "../createRef";
import { TransformRefsUseCase } from "./TransformRefsUseCase";

export const transformRefsUseCase = new TransformRefsUseCase(
    refRepo, 
    organizationRepo, 
    contactRepo, 
    userRepo, 
    subscriptionRepo, 
    couponRepo, 
    purchaseRepo, 
    invitationRepo, 
    productRepo,
    createRefUseCase
);