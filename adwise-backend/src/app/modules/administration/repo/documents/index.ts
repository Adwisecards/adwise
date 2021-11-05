import { DocumentModel } from "../../models/Document";
import { DocumentRepo } from "./implementation/DocumentRepo";

export const documentRepo = new DocumentRepo(DocumentModel);