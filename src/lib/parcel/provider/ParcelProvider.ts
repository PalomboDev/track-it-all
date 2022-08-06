import { ParcelType } from "@lib/parcel/provider/type/ParcelProviderType";

export default abstract class ParcelProvider {

    private readonly _id: string;
    private readonly _name: string;
    private readonly _type: ParcelType;

    constructor(id: string, name: string, type: ParcelType) {
        this._id = id;
        this._name = name;
        this._type = type;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): ParcelType {
        return this._type;
    }
    
    protected abstract trackingNumberRegularExpressions(): RegExp[];
    
    public isTrackingNumberForThis(trackingNumber: string): boolean {
        return this.trackingNumberRegularExpressions().some(regex => regex.test(trackingNumber));
    }
}