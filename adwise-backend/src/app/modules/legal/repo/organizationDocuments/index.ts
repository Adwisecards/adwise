import { OrganizationDocumentModel } from "../../models/OrganizationDocument";
import { OrganizationDocumentRepo } from "./implementation/OrganizationDocumentRepo";

export const organizationDocumentRepo = new OrganizationDocumentRepo(OrganizationDocumentModel);