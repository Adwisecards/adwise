import WebSocket from "ws";

export type eventType = 'contactRequest' | 
                        'purchaseAdded' | 
                        'purchaseCreated' | 
                        'purchaseConfirmed' | 
                        'taskAdded' | 
                        'taskDeleted' | 
                        'couponExpired' |
                        
                        'subscribedToOrganization' |
                        'unsubscribedFromOrganization' |
                        'purchaseCompleted' |
                        'refPurchase' |
                        'couponAdded' |
                        'couponRemoved' |
                        'purchaseShared';

export interface IEvent {
    id: string;
    type: eventType;
    subject: string;
};

export interface IEventListenerService {
    addListener(id: string, ws: WebSocket): void;
    deleteListener(id: string): void;
    getListener(id: string): WebSocket;

    dispatchEvent(event: IEvent): void
};