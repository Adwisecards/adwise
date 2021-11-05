import { refRepo } from "../../repo";
import { GetRefByCodeController } from "./GetRefByCodeController";
import { GetRefByCodeUseCase } from "./GetRefByCodeUseCase";

const getRefByCodeUseCase = new GetRefByCodeUseCase(refRepo);
const getRefByCodeController = new GetRefByCodeController(getRefByCodeUseCase);

export {
    getRefByCodeUseCase,
    getRefByCodeController
};