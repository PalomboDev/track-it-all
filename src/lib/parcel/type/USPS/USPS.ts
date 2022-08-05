import { ParcelType } from "@lib/parcel/ParcelType";

import ParcelProvider from "@lib/parcel/ParcelProvider";

export default class USPS extends ParcelProvider {
    
    private static regular_expressions: RegExp[] = [
        new RegExp("^(94|93|92|94|95)[0-9]{20}$"),
        new RegExp("^(94|93|92|94|95)[0-9]{22}$"),
        new RegExp("^(70|14|23|03)[0-9]{14}$"),
        new RegExp("^(M0|82)[0-9]{8}$"),
        new RegExp("^([A-Z]{2})[0-9]{9}([A-Z]{2})$")
    ];

    constructor() {
        super("usps", "USPS", ParcelType.USPS);
    }

    protected trackingNumberRegularExpressions(): RegExp[] {
        return USPS.regular_expressions;
    }
}