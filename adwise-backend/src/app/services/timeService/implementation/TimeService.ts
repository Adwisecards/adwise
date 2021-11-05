import { type } from "os";
import { IUseCase } from "../../../core/models/interfaces/IUseCase";
import { logger } from "../../logger";
import { ITimeService } from "../ITimeService";

export class TimeService implements ITimeService {
    private useCases: IUseCase<any, any>[];

    private schedule: {
        [key: string]: Date;
    };

    private payload: {
        [key: string]: any;
    };
    
    private executionCount = 0;
    private executionTimeSum = 0;
    private isTaskInProcess = false;

    constructor() {
        this.useCases = [];
        this.schedule = {};
        this.payload = {};
    }

    public async start(interval: number): Promise<boolean> {
        try {
            logger.info('TIME SERVICE:', `execution count: ${this.executionCount}, executionTimeSum: ${this.executionTimeSum}`);

            setInterval(async () => {
                const date = new Date();

                for (const useCase of this.useCases) {            
                    if (this.schedule[useCase.constructor.name].getTime() > date.getTime() || this.isTaskInProcess) continue;

                    const tempExecutionDate = new Date();
                    tempExecutionDate.setHours(date.getMinutes()+10);
                    this.schedule[useCase.constructor.name] = tempExecutionDate;
                    
                    this.isTaskInProcess = true
                    await this.runUseCase(useCase, interval);
                    this.isTaskInProcess = false;
                }
            }, 10000);

            return true;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }

    private async runUseCase(useCase: IUseCase<any, any>, interval: number): Promise<Date> {      
        const heapUsedBefore = process.memoryUsage().heapUsed;
        const heapTotalBefore = process.memoryUsage().heapTotal;
        const timestampBefore = new Date().getTime();
        
        const payload = this.payload[useCase.constructor.name] || {};


        logger.info('TIME SERVICE: About to run ' + useCase.constructor.name + '. Free memory: ' + this.formatMemoryUsage(heapUsedBefore)+'MB, ' + 'Total memory: ' + this.formatMemoryUsage(heapTotalBefore)+'MB');

        const result = await useCase.execute(payload);
        
        const heapUsedAfter = process.memoryUsage().heapUsed;
        const heapTotalAfter = process.memoryUsage().heapTotal;
        const timestampAfter = new Date().getTime();

        const executionTime = timestampAfter - timestampBefore;

        const executionTimeRate = this.activationFunction(executionTime, (this.executionTimeSum / (this.executionCount || 1))*2);

        if (result.isFailure) {
            logger.info('TIME SERVICE: ' + useCase.constructor.name + ' has failed. Free memory: ' + this.formatMemoryUsage(heapUsedAfter)+'MB');
        } else {
            logger.info('TIME SERVICE: ' + useCase.constructor.name + ' has been executed. ' + 'Free memory: ' + this.formatMemoryUsage(heapUsedBefore)+'MB, ' + 'Total memory: ' + this.formatMemoryUsage(heapTotalBefore)+'MB');
        }

        logger.info('TIME SERVICE: ' + useCase.constructor.name + ' execution time rate: ' + executionTimeRate, String(executionTime));

        this.executionCount++;
        this.executionTimeSum += executionTime;

        const deviation = Math.abs(executionTimeRate - 0.5);

        const newExecutionTime = new Date(timestampAfter + (interval * deviation * 100));

        this.schedule[useCase.constructor.name] = newExecutionTime;

        logger.info('TIME SERVICE: next time ' + useCase.constructor.name + ' will be executed: ' + newExecutionTime.toISOString());

        return newExecutionTime;
    }

    public add(useCase: IUseCase<any, any>, payload?: any): boolean {
        try {
            if (this.schedule[useCase.constructor.name]) {
                return true;
            }

            if (this.payload[useCase.constructor.name]) {
                return true;
            }

            this.useCases.push(useCase);
            this.schedule[useCase.constructor.name] = new Date(0);
            this.payload[useCase.constructor.name] = payload;

            logger.info('TIME SERVICE: Scheduled ' + useCase.constructor.name);

            return true;
        } catch (ex) {
            return false;
        }
    }

    private formatMemoryUsage(mem: number): number { 
        return Math.round(mem / 1024 / 1024 * 100) / 100;
    }

    private activationFunction(z: number, x: number): number {
        return 1 / (1 + Math.exp(-(z/x)));
    }
}