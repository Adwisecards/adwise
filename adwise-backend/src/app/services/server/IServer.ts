export interface IServer {
    start(port: number): Promise<any>;
};