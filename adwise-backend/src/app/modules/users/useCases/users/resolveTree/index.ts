import { wisewinService } from "../../../../../services/wisewinService";
import { userRepo } from "../../../repo/users";
import { createUserUseCase } from "../createUser";
import { signInWithWisewinUseCase } from "../signInWithWisewin";
import { ResolveTreeUseCase } from "./ResolveTreeUseCase";

const resolveTreeUseCase: ResolveTreeUseCase = new ResolveTreeUseCase(wisewinService, userRepo, signInWithWisewinUseCase);

export {
    resolveTreeUseCase
};