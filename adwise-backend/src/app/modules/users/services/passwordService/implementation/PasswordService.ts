import { IPasswordService } from "../IPasswordService";

export class PasswordService implements IPasswordService {
    public generatePassword(): string {
        return Math.floor(Math.random() * (9999999 - 1000000) + 1000000).toString();
    }
}