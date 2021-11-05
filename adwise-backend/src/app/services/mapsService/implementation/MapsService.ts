import { IAddress, IAddressDetails, IMapsService, MapsServiceLanguage } from "../IMapsService";
import {Client, AddressType, Language, LatLngArray, PlaceAutocompleteResponse} from "@googlemaps/google-maps-services-js";
import { Result } from "../../../core/models/Result";

const permutator = (inputArr: any) => {
    let result: any = [];
  
    const permute = (arr: any, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
            if (result.length > 8) break;
            let curr = arr.slice();
            let next = curr.splice(i, 1);
            permute(curr.slice(), m.concat(next))
        }
        }
   }
  
   permute(inputArr)
  
   return result;
}

export class MapsService implements IMapsService {
    private apiKey: string;
    private client: Client;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = new Client();
    }

    public async getAddressFromCoords(lat: number, long: number, language?: MapsServiceLanguage): Promise<Result<IAddress | null, Error | null>> {
        try {
            language = language ? Language[language] : Language.ru;

            const response = await this.client.reverseGeocode({
                params: {
                    key: this.apiKey,
                    latlng: `${lat},${long}`,
                    language: language as any
                }
            });

            const place = response.data.results[0];

            return Result.ok({
                addressId: place.place_id,
                addressString: place.formatted_address
            });
        } catch (ex) {
            console.log(ex);
            return Result.fail(ex);
        }
    }

    public async getAddressSuggestions(input: string, language?: MapsServiceLanguage): Promise<Result<IAddress[] | null, Error | null>> {
        try {
            language = language ? Language[language] : Language.ru;

            const regex = new RegExp('[,.]', 'ig');
            input = input.replace(regex, '');
            const inputWords = input.split(' ');
            const inputs: string[] = permutator(inputWords).map((a: string[]) => a.join(' '));

            const responses: PlaceAutocompleteResponse[] = [];

            const latLngArray: LatLngArray = [56.8431, 60.6454];

            for (const input of inputs.slice(0, 8)) {
                const response = await this.client.placeAutocomplete({
                    params: {
                        input: input,
                        key: this.apiKey,
                        location: latLngArray,
                        origin: latLngArray,
                        language: language as any
                    }
                });

                console.log(response.request);

                responses.push(response);
            }

            const places: IAddress[] = [];
            for (const response of responses) {
                places.push(...response.data.predictions.filter(p => p.terms.length >= 4).map(p => {
                    [p.terms[0], p.terms[1]] = [p.terms[1], p.terms[0]];
                    
                    let formattedAddress = p.terms.reverse().map(t => t.value).join(', ');
    
    
                    return {
                        addressId: p.place_id,
                        addressString: formattedAddress
                    };
                }));
    
            }

            const m: {[key: string]: string} = {};

            return Result.ok(places.filter((p) => {
                if (m[p.addressId]) {
                    return false;
                } else {
                    m[p.addressId] = p.addressString;
                    return true;
                }
            }));
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    public async getAddressDetailsByPlaceId(placeId: string, language?: MapsServiceLanguage): Promise<Result<IAddressDetails | null, Error | null>> {
        try {
            language = language ? Language[language] : Language.ru;

            const response = await this.client.placeDetails({
                params: {
                    place_id: placeId,
                    fields: ['name', 'address_component', 'geometry'],
                    key: this.apiKey,
                    language: language as any
                }
            })

            const place = response.data.result;

            console.log(place.address_components!);

            // place.address_components!.forEach(c => {
            //     console.log(c.long_name, c.short_name, c.types);
            // }); -> [ 'street_number' ]

            const addressStreet = place.address_components! ? place.address_components!.find(c => c.types.indexOf(AddressType.route) > -1)?.long_name || '' : '';
            const addressBuilding = place.address_components! ? place.address_components!.find(c => c.types.indexOf('street_number' as any) > -1)?.long_name || '' : '';
            const address = addressStreet && addressBuilding ? `${addressStreet} ${addressBuilding}` : place.name || '';

            const country = place.address_components! ? place.address_components!.find(c => c.types.indexOf(AddressType.country) > -1)?.long_name || '' : '';

            let region = place.address_components! ? place.address_components!.find(c => c.types.indexOf(AddressType.administrative_area_level_1) > -1)?.long_name || '' : '';

            if (!region) {
                region = place.address_components! ? place.address_components!.find(c => c.types.indexOf(AddressType.administrative_area_level_2) > -1)?.long_name || '' : '';
            }

            const city = place.address_components! ? place.address_components!.find(c => c.types.indexOf(AddressType.administrative_area_level_2) > -1)?.long_name || place.address_components!.find(c => c.types.indexOf(AddressType.locality) > -1)?.long_name || '' : '';

            const coords = Object.values(place.geometry!.location);
            
            const formattedAddress = place.formatted_address || `${city}, ${address}`;

            return Result.ok({
                address: address,
                country: country,
                region: region,
                city: city,
                coords: coords,
                formattedAddress
            });
        } catch (ex) {
            return Result.fail(ex);
        }
    }

    // public async getAddressDetailsSuggestions(input: string): Promise<Result<IAddress[] | null, Error | null>> {
    //     try {
    //         const latLngArray: LatLngArray = [56.8431, 60.6454];
                
    //         const response = await this.client.placeAutocomplete({
    //             params: {
    //                 input: input,
    //                 key: this.apiKey,
    //                 language: Language.ru,
    //                 location: latLngArray,
    //             }
    //         });

    //         const places: IAddressDetails = [];

    //         for (const prediction of response.data.predictions) {
    //             const place = prediction;

    //             const address = place.terms! ? place.terms!.find(c => c..indexOf(AddressType.country) > -1)!.value || '' : '';

    //             const country = place.terms! ? place.terms!.find(c => c.types.indexOf(AddressType.country) > -1)!.long_name || '' : '';

    //             const region = place.terms! ? place.terms!.find(c => c.types.indexOf(AddressType.administrative_area_level_1) > -1)!.long_name || '' : '';

    //             const city = place.terms! ? place.terms!.find(c => c.types.indexOf(AddressType.administrative_area_level_2) > -1)!.long_name || '' : '';

    //             const coords = Object.values(place.geometry!.location);
    //         }
            
    //         console.log(place.geometry);
    //         console.log(coords);

    //         return Result.ok({
    //             address: address,
    //             country: country,
    //             region: region,
    //             city: city,
    //             coords: coords
    //         });

    //         return Result.ok({

    //         });
    //     } catch (ex) {
    //         return Result.fail(ex);
    //     }
    // }
}