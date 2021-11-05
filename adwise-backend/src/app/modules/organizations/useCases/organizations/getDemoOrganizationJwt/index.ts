import { userRepo } from "../../../../users/repo/users";
import { authService } from "../../../../users/services/authService";
import { organizationRepo } from "../../../repo/organizations";
import { GetDemoOrganizationJwtUseCase } from "./GetDemoOrganizationJwtUseCase";
import { createDemoOrganizationUseCase } from '../createDemoOrganization';
import { GetDemoOrganizationJwtController } from "./GetDemoOrganizationJwtController";

export const getDemoOrganizationJwtUseCase = new GetDemoOrganizationJwtUseCase(
    userRepo,
    authService,
    organizationRepo,
    createDemoOrganizationUseCase
);

export const getDemoOrganizationJwtController = new GetDemoOrganizationJwtController(getDemoOrganizationJwtUseCase);