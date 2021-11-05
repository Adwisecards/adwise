import { UseCaseError } from "../UseCaseError";

//IUseCase is an interface for every useCase for this application
export interface IUseCase<Request, Response> {
    errors: UseCaseError[];
    execute(req: Request): Promise<Response>;
};