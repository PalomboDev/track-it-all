import type { NextPage } from "next";

import { useEffect, useState } from "react";

import * as ParcelHandler from "@lib/parcel/ParcelHandler";

const Home: NextPage = () => {
    const [parcelProvider, setParcelProvider] = useState<ParcelHandler.ParcelProvider | undefined>(undefined);
    const [trackingNumber, setTrackingNumber] = useState<string>("");

    return (
        <div>
            <p>Parcel Provider: {parcelProvider ? parcelProvider.name : "N/A"}</p>

            <input
                type={"text"}
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
            />

            <button onClick={() => setParcelProvider(ParcelHandler.getProviderByTrackingNumber(trackingNumber))}>
                Set
            </button>
        </div>
    );
}

export default Home;
