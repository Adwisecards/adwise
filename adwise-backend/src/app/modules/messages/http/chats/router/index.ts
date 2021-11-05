import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createChatController } from "../../../useCases/chats/createChat";

export const chatRouter = Router();

chatRouter.post('/create-chat', applyBlock, applyAuth, (req, res) => createChatController.execute(req, res));