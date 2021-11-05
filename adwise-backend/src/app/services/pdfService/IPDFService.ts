import { Result } from "../../core/models/Result";

export interface IPDFService {
    generatePDF(type: string, values: any): Promise<Result<Buffer | null, Error | null>>;
};