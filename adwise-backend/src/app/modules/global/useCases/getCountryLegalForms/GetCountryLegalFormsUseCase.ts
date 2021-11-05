import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import Country from "../../../../core/static/Country";
import CountryLegalForm from "../../../../core/static/CountryLegalForm";
import { GetCountryLegalFormsDTO } from "./GetCountryLegalFormsDTO";
import { getCountryLegalFormsErrors } from "./getCountryLegalFormsErrors";

export class GetCountryLegalFormsUseCase implements IUseCase<GetCountryLegalFormsDTO.Request, GetCountryLegalFormsDTO.Response> {
    public errors = [
        ...getCountryLegalFormsErrors
    ];

    public async execute(req: GetCountryLegalFormsDTO.Request): Promise<GetCountryLegalFormsDTO.Response> {
        if (!Country.isValid(req.country)) {
            return Result.fail(UseCaseError.create('c', 'country is not valid'));
        }

        return Result.ok({legalForms: CountryLegalForm.getList(req.country) as string[]});
    }
}