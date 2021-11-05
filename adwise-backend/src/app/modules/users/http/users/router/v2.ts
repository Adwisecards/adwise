import { userRouter } from ".";
import { applyAuth } from "../../../../../services/server/implementation/middleware/middlewares";
import { meControllerV2 } from "../../../useCases/users/me/v2";

export const userRouterV2 = userRouter;

userRouterV2.lock('/me');
userRouterV2.get('/me', applyAuth, (req, res) => meControllerV2.execute(req, res));