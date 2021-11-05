import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ITransaction } from "../../models/Transaction";

export interface ITransactionRepo extends IRepo<ITransaction> {
    findByTypeAndTo(type: string, to: string, limit?: number, page?: number): RepoResult<ITransaction[]>;
    findByTypeAndFrom(type: string, from: string, dateFrom?: Date, dateTo?: Date): RepoResult<ITransaction[]>;
    searchWithType(type: string, parameterName: string, parameterValue: string, sortBy: string, order: number, pageSize: number, pageNumber: number, populate?: string): RepoResult<ITransaction[]>;
    findByContexts(contexts: string[], dateFrom?: Date): RepoResult<ITransaction[]>;
    findByTo(to: string, dateFrom?: Date): RepoResult<ITransaction[]>;
    findByFrom(from: string, dateFrom?: Date): RepoResult<ITransaction[]>;
    findByType(type: string, limit: number, page: number): RepoResult<ITransaction[]>;
    findByFromAndOrigin(from: string, origin: string, dateFrom?: Date, dateTo?: Date): RepoResult<ITransaction[]>;
    findManyByOriginsAndTypes(origins: string[], type: string, sortBy: string, order: number, pageSize: number, pageNumber: number): RepoResult<ITransaction[]>;
    countManyByOriginsAndTypes(origins: string[], type: string): RepoResult<number>;
    findManyWithoutContext(): RepoResult<ITransaction[]>;
    findManyByFrozen(frozen: boolean): RepoResult<ITransaction[]>;
    findManyByToAndFrozenAndDisabled(to: string, frozen: boolean, disabled: boolean): RepoResult<ITransaction[]>;
    findManyByTypeAndContext(type: string, context: string): RepoResult<ITransaction[]>;
    setManyDisabledByIds(ids: string[], disabled: boolean): RepoResult<boolean>;
};