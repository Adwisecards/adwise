import { configProps } from "../config";
import { CurrencyService } from "./implementation/CurrencyService";

const currencyService = new CurrencyService(configProps.curconvUrl, configProps.curconvKey);

export {
    currencyService
};