type RepoErrorCode = 404 | 500 | 400 | 403;

export class RepoError extends Error {
    public code: RepoErrorCode;
    constructor(message: string, code: RepoErrorCode) {
        super(message);
        this.code = code;
    }
};