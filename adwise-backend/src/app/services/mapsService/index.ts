import { configProps } from "../config";
import { DaDataMapsService } from "./implementation/DaDataMapsService";
import { MapsService } from "./implementation/MapsService";

const mapsService = new MapsService(configProps.googleMapsToken);
//const mapsService = new DaDataMapsService(configProps.daDataKey, configProps.daDataSecretKey);

export {
    mapsService
};