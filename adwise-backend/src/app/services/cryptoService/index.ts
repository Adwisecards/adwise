import { configProps } from "../config";
import { CryptoService } from "./implementation/CryptoService";

const cryptoService = new CryptoService(configProps.cryptoUrl, configProps.coincupUrl);

export {
    cryptoService
};