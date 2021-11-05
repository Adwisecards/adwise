import { OrganizationModel } from "../../models/Organization";
import { OrganizationRepo } from "./implementation/OrganizationRepo";

const organizationRepo = new OrganizationRepo(OrganizationModel);

export {
    organizationRepo
};