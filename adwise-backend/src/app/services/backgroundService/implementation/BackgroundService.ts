import { IBackgroundService } from "../IBackgroundService";

export class BackgroundService implements IBackgroundService {
    public runInBackground(func: () => any) {
        func();
    }
}