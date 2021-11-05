import { mediaService } from "../../../../../services/mediaService";
import { updateContactUseCase } from "../../../../contacts/useCases/contacts/updateContact";
import { generateUserDocumentUseCase } from "../../../../legal/useCases/userDocuments/generateUserDocument";
import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { UpdateUserController } from "./UpdateUserController";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

const updateUserUseCase = new UpdateUserUseCase(
    userRepo, 
    userValidationService, 
    mediaService, 
    updateContactUseCase,
    generateUserDocumentUseCase
);

const updateUserController = new UpdateUserController(updateUserUseCase);

export {
    updateUserUseCase,
    updateUserController
};