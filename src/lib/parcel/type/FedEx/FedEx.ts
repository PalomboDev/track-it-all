import { ParcelType } from "@lib/parcel/ParcelType";

import ParcelProvider from "@lib/parcel/ParcelProvider";

export default class FedEx extends ParcelProvider {
    
    private static regular_expressions: RegExp[] = [
        new RegExp("^[0-9]{20}$"),
        new RegExp("^[0-9]{15}$"),
        new RegExp("^[0-9]{12}$"),
        new RegExp("^[0-9]{22}$")
    ];

    constructor() {
        super("fedex", "FedEx", ParcelType.FedEx);
    }

    protected trackingNumberRegularExpressions(): RegExp[] {
        return FedEx.regular_expressions;
    }
}