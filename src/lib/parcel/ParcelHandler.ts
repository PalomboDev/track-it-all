import { ParcelType } from "./ParcelType";

import ParcelProvider from "@lib/parcel/ParcelProvider";

import FedEx from "@lib/parcel/type/FedEx/FedEx";
import UPS from "@lib/parcel/type/UPS/UPS";
import USPS from "@lib/parcel/type/USPS/USPS";

const fedExParcelProvider = new FedEx();
const upsParcelProvider = new UPS();
const uspsParcelProvider = new USPS();

const parcelProviders: ParcelProvider[] = [
    fedExParcelProvider,
    upsParcelProvider,
    uspsParcelProvider
];

export function getProviderById(id: string): ParcelProvider | undefined {
    return parcelProviders.find(provider => provider.id === id);
}

export function getProviderByType(type: ParcelType): ParcelProvider | undefined {
    return parcelProviders.find(provider => provider.type === type);
}

export function getProviderByTrackingNumber(trackingNumber: string): ParcelProvider | undefined {
    return parcelProviders.find(provider => provider.isTrackingNumberForThis(trackingNumber));
}

export { ParcelType, ParcelProvider };