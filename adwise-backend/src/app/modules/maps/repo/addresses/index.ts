import { AddressModel } from "../../models/Address";
import { AddressRepo } from "./implementation/AddressRepo";

export const addressRepo = new AddressRepo(AddressModel);