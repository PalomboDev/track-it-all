import type { NextPage } from "next";

import { Box, Container, Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";

import Parcel, { ParcelRecipient, ParcelEvent } from "@lib/parcel/Parcel";

import TrackBox from "@components/track/TrackBox";

const Index: NextPage = () => {
    const [parcel, setParcel] = useState<Parcel | undefined>(undefined);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                margin: "25px"
            }}
        >
            <Container>
                <TrackBox
                    parcel={parcel}
                    setParcel={setParcel}
                />

                {parcel && <ParcelInformation parcel={parcel} />}
            </Container>
        </Box>
    );
}

type ParcelInformationProps = {
    parcel: Parcel;
};

function ParcelInformation({ parcel }: ParcelInformationProps): JSX.Element {
    return (
        <Box>
            <Text>{parcel.trackingNumber}</Text>
            <Text>{parcel.provider}</Text>

            <ParcelInformationRecipient
                recipient={parcel.recipient}
            />

            {parcel.events.map((event: ParcelEvent, index: number) => {
                return (
                    <ParcelInformationEvent
                        key={index}
                        event={event}
                    />
                )
            })}
        </Box>
    );
}

type ParcelInformationRecipientProps = {
    recipient: ParcelRecipient;
};

function ParcelInformationRecipient({ recipient }: ParcelInformationRecipientProps): JSX.Element {
    return (
        <Box
            sx={{
                borderBottom: "1px solid #ccc",
                padding: "1rem"
            }}
        >
            <Text>{recipient.name}</Text>
            <Text>{recipient.address}</Text>
            <Text>{recipient.postCode} {recipient.city} {recipient.subdivision}</Text>
        </Box>
    );
}

type ParcelInformationEventProps = {
    event: ParcelEvent;
};

function ParcelInformationEvent({ event }: ParcelInformationEventProps): JSX.Element {
    return (
        <Box
            sx={{
                borderBottom: "1px solid #ccc",
                padding: "1rem"
            }}
        >
            <Text>{event.status}</Text>
            <Text>{event.date.toLocaleString()}</Text>
            <Text>{event.location}</Text>
        </Box>
    );
}

export default Index;
