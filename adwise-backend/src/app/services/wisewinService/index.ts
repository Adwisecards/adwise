import { configProps } from "../config";
import { WisewinService } from "./implementation/WisewinService";

const wisewinService = new WisewinService(configProps.wisewinUrl);

export {
    wisewinService
};