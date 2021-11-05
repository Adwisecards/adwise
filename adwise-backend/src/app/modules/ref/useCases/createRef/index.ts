import { refRepo } from "../../repo";
import { refValidationService } from "../../services/refValidationService";
import { CreateRefUseCase } from "./CreateRefUseCase";

export const createRefUseCase = new CreateRefUseCase(refRepo, refValidationService);