import { Request } from "express";
import WebSocket from "ws";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { ListenToUserEventsDTO } from "./ListenToUserEventsDTO";

export class ListenToUserEventsController {
    private useCase: IUseCase<ListenToUserEventsDTO.Request, ListenToUserEventsDTO.Response>;
    constructor(useCase: IUseCase<any, any>) {
        this.useCase = useCase;
    }

    public async execute(ws: WebSocket, req: Request) {
        const dto: ListenToUserEventsDTO.Request = {
            userId: req.params.id,
            ws: ws,
            type: 'open'
        };

        const result = await this.useCase.execute({...dto, type: 'open'});
        if (result.isFailure) {
            ws.send(JSON.stringify({
                type: 'error',
                error: result.getError()
            }));
            return ws.close(1011);
        }

        ws.send(JSON.stringify({
            type: 'init',
            id: dto.userId
        }));

        ws.on('close', async () => {
            await this.useCase.execute({...dto, type: 'close'});
        });
    }
}