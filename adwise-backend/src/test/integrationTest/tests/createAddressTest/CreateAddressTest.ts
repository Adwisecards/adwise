import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IAddress } from "../../../../app/modules/maps/models/Address";
import { CreateAddressFromCoordsDTO } from "../../../../app/modules/maps/useCases/addresses/createAddressFromCoords/CreateAddressFromCoordsDTO";
import { CreateAddressFromCoordsUseCase } from "../../../../app/modules/maps/useCases/addresses/createAddressFromCoords/CreateAddressFromCoordsUseCase";

interface ICreateAddressObjects {
    address: IAddress;
};

export class CreateAddressTest {
    private createAddressFromCoordsUseCase: CreateAddressFromCoordsUseCase;

    constructor(
        createAddressFromCoordsUseCase: CreateAddressFromCoordsUseCase
    ) {
        this.createAddressFromCoordsUseCase = createAddressFromCoordsUseCase;
    }

    public async execute(): Promise<Result<ICreateAddressObjects | null, UseCaseError | null>> {
        const addressData: CreateAddressFromCoordsDTO.Request = {
            lat: 56.83610369209932,
            long: 60.61449836127701
        };

        const addressCreated = await this.createAddressFromCoordsUseCase.execute(addressData);
        if (addressCreated.isFailure) {
            return Result.fail(addressCreated.getError());
        }

        const { address } = addressCreated.getValue()!;

        return Result.ok({address});
    }
}