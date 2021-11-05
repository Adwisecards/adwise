import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAdvantage } from "../../../models/Advantage";

export namespace GetAdvantagesDTO {
    export interface Request {

    };

    export interface ResponseData {
        advantages: IAdvantage[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};