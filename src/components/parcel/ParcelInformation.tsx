import { useEffect, useState } from "react";
import { ParcelEvent, ParcelRecipient } from "@lib/types/parcel";
import { Box, Container, Text, Timeline } from "@mantine/core";
import { useStatusToIcon } from "@hooks/useStatusToIcon";

import Parcel from "@lib/parcel/Parcel";

type ParcelInformationProps = {
    parcel: Parcel;
};

export function ParcelInformation({ parcel }: ParcelInformationProps): JSX.Element {
    const [isDelivered, setIsDelivered] = useState<boolean>(false);

    const recipient: ParcelRecipient = parcel.recipient;

    useEffect(() => {
        setIsDelivered(false);

        if (parcel.events.length > 0) {
            const firstEvent: ParcelEvent = parcel.events[0];
            const firstEventStatus: string = firstEvent.status.toLowerCase();
            const deliveredTerms: string[] = ["delivered", "arrived", "picked up"]

            for (let deliveredTerm of deliveredTerms) {
                if (firstEventStatus.includes(deliveredTerm)) {
                    setIsDelivered(true);
                    break;
                }
            }
        }
    }, [parcel]);

    return (
        <Box>
            {/* Package Info */}
            <Container
                id={"info"}
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "gray.200",
                    borderRadius: "lg",
                    paddingTop: "1rem",
                    paddingBottom: "1rem"
                }}
            >
                <Text size={"xl"}><strong>Package Info</strong></Text>

                <Text>Tracking Number: {parcel.trackingNumber}</Text>
                {/* <Text>Package Provider: {parcel.provider}</Text> */}
            </Container>

            {/* Recipient */}
            <Container
                id={"recipient"}
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "gray.200",
                    borderRadius: "lg",
                    paddingTop: "1rem",
                    paddingBottom: "1rem"
                }}
            >
                <Text size={"xl"}><strong>Recipient</strong></Text>

                <Text>Name: {recipient.name ?? "N/A"}</Text>
                <Text>Address: {recipient.address ?? "N/A"}</Text>
                <Text>City: {recipient.city ?? "N/A"}</Text>
                <Text>Post Code: {recipient.postCode ?? "N/A"}</Text>
                <Text>Subdivision: {recipient.subdivision ?? "N/A"}</Text>
            </Container>

            {/* Events */}
            <Container
                id={"events"}
                sx={{
                    paddingTop: "1rem",
                    paddingBottom: "1rem"
                }}
            >
                <Text
                    size={"xl"}
                    sx={{
                        paddingBottom: "1rem"
                    }}
                >
                    <strong>Status</strong>
                </Text>

                {parcel.events.length === 0 &&
                    <Text
                        sx={{
                            color: "black"
                        }}
                    >
                        No status found. Check back later.
                    </Text>
                }

                <Timeline
                    color={isDelivered ? "green" : "orange"}
                    active={parcel.events.length - 1}
                    bulletSize={30}
                    lineWidth={4}
                >
                    {parcel && parcel.events.map((event: ParcelEvent, index: number) => {
                        return (
                            <Timeline.Item
                                key={index}
                                title={event.status}
                                bulletSize={index === 0 ? 30 : 20}
                                bullet={useStatusToIcon(event.status)}
                                lineVariant={"solid"}
                            >
                                <Text color={"dimmed"} size={"sm"}>
                                    {event.location}
                                </Text>
                                <Text size={"xs"} mt={4}>
                                    {`${event.date.toLocaleTimeString()} on ${event.date.toLocaleDateString()}`}
                                </Text>
                            </Timeline.Item>
                        )
                    })}
                </Timeline>
            </Container>
        </Box>
    );
}
