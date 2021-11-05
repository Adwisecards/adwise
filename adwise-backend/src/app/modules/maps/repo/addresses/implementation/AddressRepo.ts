import { Repo } from "../../../../../core/models/Repo";
import { IAddressModel, IAddress } from "../../../models/Address";
import { IAddressRepo } from "../IAddressRepo";

export class AddressRepo extends Repo<IAddress, IAddressModel> implements IAddressRepo {

}