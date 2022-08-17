import type { GetServerSidePropsContext, NextPage } from "next";
import type { User } from "@prisma/client";

import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { ParcelInformation } from "@components/parcel/ParcelInformation";
import { GetServerSidePropsResult } from "next";
import { getUserServerSideProps } from "@lib/auth-server";

import Parcel from "@lib/parcel/Parcel";
import Layout from "@components/layout/Layout";
import TrackBox from "@components/track/TrackBox";

type IndexProps = {
    user: User | null;
};

const Index: NextPage<IndexProps> = ({ user }) => {
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
        <Layout user={user}>
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

                {parcel && <ParcelInformation
                    user={user}
                    parcel={parcel}
                />}
            </Box>
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<IndexProps>> {
    return getUserServerSideProps(context);
}

export default Index;
