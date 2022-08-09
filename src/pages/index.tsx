import type { NextPage } from "next";

import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { ParcelInformation } from "@components/parcel/ParcelInformation";

import Parcel from "@lib/parcel/Parcel";
import Layout from "@components/layout/Layout";
import TrackBox from "@components/track/TrackBox";

const Index: NextPage = () => {
    const router: NextRouter = useRouter();

    const [parcel, setParcel] = useState<Parcel | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (parcel?.trackingNumber) {
            router.push({
                pathname: "/",
                query: {
                    trackingNumber: parcel.trackingNumber
                }
            }, undefined, {
                shallow: true
            }).catch(console.error);
        }
    }, [parcel]);

    return (
        <Layout>
            <Box
                sx={{
                    margin: "auto",
                    maxWidth: "750px",

                    "@media (max-width: 768px)": {
                        margin: "0px 10px"
                    }
                }}
            >
                <TrackBox
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    parcel={parcel}
                    setParcel={setParcel}
                />

                {parcel && <ParcelInformation parcel={parcel}/>}
            </Box>
        </Layout>
    );
}

export default Index;
