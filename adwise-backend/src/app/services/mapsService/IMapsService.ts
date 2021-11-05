import { Result } from "../../core/models/Result";

export interface IAddress {
    addressString: string;
    addressId: string;
};

export interface IAddressDetails {
    coords: any;
    country: string;
    city: string;
    region: string;
    address: string;
    formattedAddress: string;
};

export type MapsServiceLanguage = 'ru' | 'en';

export interface IMapsService {
    getAddressFromCoords(lat: number, long: number, language?: MapsServiceLanguage): Promise<Result<IAddress | null, Error | null>>;
    getAddressSuggestions(input: string, language?: MapsServiceLanguage): Promise<Result<IAddress[] | null, Error | null>>;
    getAddressDetailsByPlaceId(placeId: string, language?: MapsServiceLanguage): Promise<Result<IAddressDetails | null, Error | null>>;
    // getAddressDetailsSuggestions(input: string): Promise<Result<IAddressDetails[] | null, Error | null>>;
};