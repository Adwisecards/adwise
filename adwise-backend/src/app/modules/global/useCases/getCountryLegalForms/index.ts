import { GetCountryLegalFormsController } from "./GetCountryLegalFormsController";
import { GetCountryLegalFormsUseCase } from "./GetCountryLegalFormsUseCase";

const getCountryLegalFormsUseCase = new GetCountryLegalFormsUseCase();
const getCountryLegalFormsController = new GetCountryLegalFormsController(getCountryLegalFormsUseCase);

export {
    getCountryLegalFormsController,
    getCountryLegalFormsUseCase
};