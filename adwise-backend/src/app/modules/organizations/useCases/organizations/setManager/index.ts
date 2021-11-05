import { generateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument";
import { refRepo } from "../../../../ref/repo";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { SetManagerController } from "./SetManagerController";
import { SetManagerUseCase } from "./SetManagerUseCase";

const setManagerUseCase = new SetManagerUseCase(
    refRepo,
    userRepo, 
    organizationRepo,
    generateOrganizationDocumentUseCase 
);
const setManagerController = new SetManagerController(setManagerUseCase);

export {
    setManagerUseCase,
    setManagerController
};