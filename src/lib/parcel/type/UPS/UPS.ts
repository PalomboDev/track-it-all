import { ParcelType } from "@lib/parcel/ParcelType";

import ParcelProvider from "@lib/parcel/ParcelProvider";

export default class UPS extends ParcelProvider {
    
    private static regular_expressions: RegExp[] = [
        new RegExp("^(1Z)[0-9A-Z]{16}$"),
        new RegExp("^(T)+[0-9A-Z]{10}$"),
        new RegExp("^[0-9]{9}$"),
        new RegExp("^[0-9]{26}$")
    ];    

    constructor() {
        super("ups", "UPS", ParcelType.UPS);
    }

    protected trackingNumberRegularExpressions(): RegExp[] {
        return UPS.regular_expressions;
    }
}