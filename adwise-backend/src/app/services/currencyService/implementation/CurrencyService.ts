import { ICurrencyService } from "../ICurrencyService";
import * as axios from 'axios';
import { Result } from "../../../core/models/Result";

export class CurrencyService implements ICurrencyService {
    private transport: axios.AxiosInstance;
    private apiKey: string;
    constructor(baseUrl: string, apiKey: string) {
        this.apiKey = apiKey;
        this.transport = this.configureTransport(baseUrl);
    }

    public async exchange(from: string, to: string, date?: Date): Promise<Result<number | null, number | null>> {
        try {
            const pair = `${from}_${to}`.toUpperCase();

            const dateString = date ? date.toISOString().split('T')[0] : undefined;

            const {data} = await this.transport.get(`/convert?q=${pair}&compact=ultra&apiKey=${this.apiKey}${date ? '&date='+dateString : ''}`);

            if (data[pair]) {
                if (date) {
                    return Result.ok(data[pair][dateString!]);
                }
                return Result.ok(data[pair]);
            } else {
                return Result.fail(0);
            }
        } catch (ex) {
            return Result.fail(0);
        }
    }

    private configureTransport(baseUrl: string): axios.AxiosInstance {
        return axios.default.create({
            baseURL: baseUrl,
            withCredentials: true
        });
    }
}