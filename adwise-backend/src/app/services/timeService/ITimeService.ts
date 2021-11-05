import { IUseCase } from "../../core/models/interfaces/IUseCase";

export interface ITimeService {
    start(interval: number): Promise<boolean>;
    add(useCase: IUseCase<any, any>, payload?: any): boolean;
};