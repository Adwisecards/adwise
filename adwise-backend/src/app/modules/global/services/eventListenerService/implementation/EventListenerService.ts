import WebSocket from "ws";
import { IEvent, IEventListenerService } from "../IEventListenerService";

export class EventListenerService implements IEventListenerService {
    private listeners: Map<string, WebSocket> = new Map<string, WebSocket>();

    public addListener(id: string, ws: WebSocket): void {
        this.listeners.set(id, ws);
    }

    public deleteListener(id: string): void {
        this.listeners.delete(id);
    }

    public getListener(id: string): WebSocket {
        return this.listeners.get(id)!;
    }
    
    public dispatchEvent(event: IEvent): void {
        const ws = this.getListener(event.id);
        if (!ws) {
            return;
        }
        
        ws.send(JSON.stringify({
            type: event.type,
            id: event.subject
        }));
    }
}