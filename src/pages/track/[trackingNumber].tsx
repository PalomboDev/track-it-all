import type { NextPage } from "next";

import { useEffect, useState } from "react";
import { useRouter, NextRouter } from "next/router";

import * as ParcelHandler from "@lib/parcel/ParcelHandler";

const TrackTrackingNumber: NextPage = () => {
    const router: NextRouter = useRouter();
    const { trackingNumber } = router.query;

    const [parcelProvider, setParcelProvider] = useState<ParcelHandler.ParcelProvider | undefined>(undefined);
    
    useEffect(() => {
        setParcelProvider(ParcelHandler.getProviderByTrackingNumber(trackingNumber as string));
    } , [trackingNumber]);
    
    if (!trackingNumber) {    
        return <> </>;
    }
    
    if (!parcelProvider) {
        return (
            <div>
                <p>No provider found for tracking number {trackingNumber}</p>
            </div>
        );
    }

    return (
        <div>
            <p>Tracking Number: {trackingNumber}</p>
            <p>Parcel Provider: {parcelProvider.name}</p>
        </div>
    );
}

export default TrackTrackingNumber;
