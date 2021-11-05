import { ICryptoService } from "../ICryptoService";
import * as axios from 'axios';
import { Result } from "../../../core/models/Result";
import { UseCaseError } from "../../../core/models/UseCaseError";
import WS from 'ws';

export class CryptoService implements ICryptoService {
    private transport: axios.AxiosInstance;
    private wsUrl: string;
    constructor(baseUrl: string, wsUrl: string) {
        this.transport = this.configureTransport(baseUrl);
        this.wsUrl = wsUrl;
    }

    public async createTransaction(walletAddress: string, amount: number) {
        try {
            const {data} = await this.transport.get(`/withdraw/adwise-withdraw?address=${walletAddress}&amount=${amount}`);
            
            return Result.ok(data.hash);
        } catch (ex) {
            console.log(ex);
            return Result.fail(UseCaseError.create('a', 'Error upon creating transaction'));
        }
    }

    public async exchangeRubForBnb(amount: number): Promise<Result<number | null, Error | null>> {
        return new Promise<any>(resolve => {
            const ws = new WS(this.wsUrl);
            let rubRate = 0;
            let bnbRate = 0;

            ws.on('message', (data: any) => {
                data = JSON.parse(data);

                if (data.event == 'current_fiats') {
                    rubRate = data.data.find((c: any) => c.code == 'RUB').price_usd;
                }

                if (data.event == 'current_currencies') {
                    bnbRate = data.data.find((c: any) => c.code == 'BNB').price_usd;
                }
            });

            const interval = setInterval(() => {
                if (rubRate && bnbRate) {
                    const amountUsd = rubRate*amount;
                    const bnb = amountUsd / bnbRate;

                    clearInterval(interval);
                    ws.close();

                    resolve(Result.ok(bnb));
                }
            }, 10);

            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                resolve(Result.fail(new Error('Timeout')));
            }, 10000);
        });
    }

    private configureTransport(baseUrl: string) {
        return axios.default.create({
            baseURL: baseUrl
        });
    }
}