import type { ParcelRecipient, ParcelEvent } from "@lib/types";

export default class Parcel {

    private readonly _trackingNumber: string;
    private readonly _provider: string;
    private readonly _recipient: ParcelRecipient;
    private readonly _events: ParcelEvent[];

    constructor(trackingNumber: string, provider: string, recipient: ParcelRecipient, events: ParcelEvent[]) {
        this._trackingNumber = trackingNumber;
        this._provider = provider;
        this._recipient = recipient;
        this._events = events;
    }

    get trackingNumber(): string {
        return this._trackingNumber;
    }

    get provider(): string {
        return this._provider;
    }

    get recipient(): ParcelRecipient {
        return this._recipient;
    }

    get events(): ParcelEvent[] {
        return this._events.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
}
