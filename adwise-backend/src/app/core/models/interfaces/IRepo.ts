import { Result } from "../Result";
import { RepoError } from "../RepoError";

export type RepoResult<D> = Promise<Result<D | null, RepoError | null>>

export interface IRepo<D> {
    save(model: D): RepoResult<D>;
    findById(id: string): RepoResult<D>;
    search(parameterNames: string[], parameterValues: string[], sortBy: string, order: number, pageSize: number, pageNumber: number, populate?: string): RepoResult<D[]>;
    count(parameterNames: string[], parameterValues: string[]): RepoResult<number>;
    getAll(): RepoResult<D[]>;
    deleteById(id: string): RepoResult<D>;
    populate(d: D, field: string, projection: string): RepoResult<D>;
    findByIds(ids: string[]): RepoResult<D[]>;
    deleteByIds(ids: string[]): RepoResult<any>;
};