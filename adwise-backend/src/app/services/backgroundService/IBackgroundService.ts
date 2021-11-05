export interface IBackgroundService {
    runInBackground(func: () => any): void;
};