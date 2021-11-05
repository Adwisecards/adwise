import { UserModel } from "../../models/User";
import { UserRepo } from "./implementation/UserRepo";

const userRepo = new UserRepo(UserModel);

export {
    userRepo
};