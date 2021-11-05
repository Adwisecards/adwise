import { logger } from "../../services/logger";
import { UseCaseError } from "./UseCaseError";

// Result is a class that implements result for every important operation in this application
export class Result<V, E> {
    public isSuccess: boolean;
    public isFailure: boolean;
    private error: E;
    private value: V;

    constructor(isSuccess: boolean, value: V, error: E) {
        if (isSuccess && error) {
            throw new Error('Result cannot be successful and contain an error');
        }

        if (!isSuccess && !error) {
            throw new Error('Result cannot fail without an error');
        }

        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.value = value;
        this.error = error;


    }

    public static ok<V>(value: V): Result<V, null> {
        return new Result<V, null>(true, value, null);
    }

    public static fail<E>(error: E): Result<null, E> {
        if (error instanceof UseCaseError) {
            logger.error(error.stack!, error.code, error.message, error.details);
        }

        if (error instanceof Error) {
            logger.error(error.stack!, error.message);
        }

        logger.info(String(process.memoryUsage().heapUsed));
        
        return new Result<null, E>(false, null, error);
    }

    public getError(): E {
        if (this.isSuccess) {
            throw new Error('Cannot get error of success');
        }

        return this.error;
    }

    public getValue(): V {
        if (!this.isSuccess) {
            throw new Error('Cannot get value of failure');
        }

        return this.value;
    }
}
