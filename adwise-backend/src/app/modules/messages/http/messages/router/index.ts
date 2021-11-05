import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createMessageController } from "../../../useCases/messages/createMessage";

export const messageRouter = Router();

messageRouter.post('/create-message', applyBlock, applyAuth, (req, res) => createMessageController.execute(req, res));