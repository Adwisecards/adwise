import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMapsService, MapsServiceLanguage } from "../../../../../services/mapsService/IMapsService";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { AddressModel } from "../../../models/Address";
import { IAddressRepo } from "../../../repo/addresses/IAddressRepo";
import { IAddressValidationService } from "../../../services/addresses/addressValidationService/IAddressValidationService";
import { CreateAddressFromCoordsDTO } from "./CreateAddressFromCoordsDTO";
import { createAddressFromCoordsErrors } from "./createAddressFromCoordsErrors";

export class CreateAddressFromCoordsUseCase implements IUseCase<CreateAddressFromCoordsDTO.Request, CreateAddressFromCoordsDTO.Response> {
    private mapsService: IMapsService;
    private addressRepo: IAddressRepo;
    private addressValidationService: IAddressValidationService;

    public errors = createAddressFromCoordsErrors;
    
    constructor(
        mapsService: IMapsService,
        addressRepo: IAddressRepo,
        addressValidationService: IAddressValidationService
    ) {
        this.mapsService = mapsService;
        this.addressRepo = addressRepo;
        this.addressValidationService = addressValidationService;
    }

    public async execute(req: CreateAddressFromCoordsDTO.Request): Promise<CreateAddressFromCoordsDTO.Response> {
        const valid = this.addressValidationService.createAddressFromCoordsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        } 

        const addressGotten = await this.mapsService.getAddressFromCoords(req.lat, req.long, req.language as MapsServiceLanguage);
        if (addressGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting address'));
        }

        const addressInfo = addressGotten.getValue()!;

        const addressDetailsGotten = await this.mapsService.getAddressDetailsByPlaceId(addressInfo.addressId, req.language as MapsServiceLanguage);
        if (addressDetailsGotten.isFailure) {
            console.log(addressDetailsGotten.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon getting address details'));
        }

        const addressDetails = addressDetailsGotten.getValue()!;

        const addressDetailsValid = this.addressValidationService.addressDetailsData(addressDetails);
        if (addressDetailsValid.isFailure) {
            return Result.fail(UseCaseError.create('c', addressDetailsValid.getError()!));
        }

        console.log(addressDetails);

        const address = new AddressModel({
            country: addressDetails.country,
            region: addressDetails.region,
            city: addressDetails.city,
            address: addressDetails.address,
            details: req.details,
            coords: addressDetails.coords,
            placeId: addressDetails.formattedAddress,
            language: req.language
        });

        const addressSaved = await this.addressRepo.save(address);
        if (addressSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving address'));
        }

        return Result.ok({
            address: address
        });
    }
}