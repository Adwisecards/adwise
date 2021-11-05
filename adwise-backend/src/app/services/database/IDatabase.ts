export interface IDatabase {
    connect(URL: string, options: any): Promise<any>;
    dropDatabase(): Promise<any>;
};