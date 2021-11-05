import Axios, {AxiosInstance} from 'axios';
import { Result } from '../../../core/models/Result';
import { IMapsService, IAddress, IAddressDetails, MapsServiceLanguage } from '../IMapsService';

export class DaDataMapsService implements IMapsService {
    private suggestionsBaseUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs';
    private cleanerBaseUrl = 'https://cleaner.dadata.ru/api/v1';

    private secretKey: string;

    private suggestionsTransport: AxiosInstance;
    private cleanerTransport: AxiosInstance;

    constructor(apiKey: string, secretKey: string) {
        this.secretKey = secretKey;
        this.suggestionsTransport = this.configureTransport(this.suggestionsBaseUrl, apiKey);
        this.cleanerTransport = this.configureTransport(this.cleanerBaseUrl, apiKey);
    }

    public async getAddressDetailsByPlaceId(placeId: string, language?: MapsServiceLanguage): Promise<Result<IAddressDetails | null, Error | null>> {
        try {
            console.log(language);

            const response = await this.cleanerTransport.post('/clean/address', [placeId], {
                headers: {
                    "X-Secret": this.secretKey
                }
            });

            const {data} = response

            if (!data.length) {
                return Result.fail(new Error('No address details found'));
            }

            const addressDetails = data[0];

            return Result.ok({
                address: addressDetails.result || '',
                city: addressDetails.city || addressDetails.region || '',
                country: addressDetails.country || '',
                coords: [Number(addressDetails['geo_lat']), Number(addressDetails['geo_lon'])],
                region: addressDetails['region_with_type'] || addressDetails.region || '',
                formattedAddress: addressDetails.result
            });
        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    public async getAddressFromCoords(lat: number, long: number, language?: MapsServiceLanguage): Promise<Result<IAddress | null, Error | null>> {
        try {
            console.log(language);

            console.log(lat, long);
            const {data} = await this.suggestionsTransport.get(`/geolocate/address?lat=${lat}&lon=${long}`);

            console.log(data);

            if (!data.suggestions.length) {
                return Result.fail(new Error('No suggestions found'));
            }

            const suggestion = data.suggestions[0];

            return Result.ok({
                addressId: suggestion.value,
                addressString: suggestion.value
            });
        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    public async getAddressSuggestions(search: string, language?: MapsServiceLanguage): Promise<Result<IAddress[] | null, Error | null>> {
        try {
            console.log(language);

            const {data} = await this.suggestionsTransport.get(`/suggest/address/?query=${encodeURI(search)}`);

            const addresses = data.suggestions.map((s: any) => {
                return {
                    addressString: s.value,
                    addressId: s.value
                };
            });

            return Result.ok(addresses);
        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    private configureTransport(baseUrl: string, apiKey: string): AxiosInstance {
        return Axios.create({
            baseURL: baseUrl,
            headers: {
                "Authorization": "Token " + apiKey
            }
        });
    }
}