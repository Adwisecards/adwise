import { UserDocumentModel } from "../../models/UserDocument";
import { UserDocumentRepo } from "./implementation/UserDocumentRepo";

export const userDocumentRepo = new UserDocumentRepo(UserDocumentModel);