import { configProps } from "../../../../services/config";
import { AuthService } from "./implementation/AuthService";

const authService = new AuthService(configProps.appSecret, configProps.jwtExpriresIn);

export {
    authService
};