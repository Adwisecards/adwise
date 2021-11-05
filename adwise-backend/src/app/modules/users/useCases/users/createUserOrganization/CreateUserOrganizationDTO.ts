import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { CreateOrganizationDTO } from "../../../../organizations/useCases/organizations/createOrganization/CreateOrganizationDTO";
import { CreateUserDTO } from "../createUser/CreateUserDTO";

export namespace CreateUserOrganizationDTO {
    export interface Request {
        user: CreateUserDTO.Request;
        organization: CreateOrganizationDTO.Request;
    };

    export interface ResponseData extends CreateUserDTO.ResponseData {
        
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};