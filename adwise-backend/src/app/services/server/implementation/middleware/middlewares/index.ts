import { globalRepo } from "../../../../../modules/administration/repo/globals";
import { authService } from "../../../../../modules/users/services/authService";
import { Auth } from "./Auth";
import { Block } from "./Block";

const auth = new Auth(authService);
const applyAuth = auth.apply.bind(auth);
const applyAdmin = auth.applyAdmin.bind(auth);
const applyDecode = auth.applyDecode.bind(auth);
const applyAdminGuest = auth.applyAdminGuest.bind(auth);

const block = new Block(globalRepo);
const applyBlock = block.apply.bind(block);

export {
    applyAuth,
    applyAdmin,
    applyBlock,
    applyDecode,
    applyAdminGuest
};