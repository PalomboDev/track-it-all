import { TextInput, Button, Group, Box, Center, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

import Parcel, { ParcelRecipient, ParcelEvent } from "@lib/parcel/Parcel";

type TrackBoxProps = {
    parcel: Parcel | undefined;
    setParcel: (parcel: Parcel | undefined) => void;
};

export default function TrackBox({ parcel, setParcel }: TrackBoxProps): JSX.Element {
    const form = useForm({
        initialValues: {
            trackingNumber: ""
        },
        validate: {
            trackingNumber: (value) => (value.length > 0 ? null : "Invalid tracking number")
        }
    });

    async function onSubmit(values: any): Promise<void> {
        const trackingNumber: string | undefined = values.trackingNumber;

        if (!trackingNumber) {
            return;
        }

        const response: Response = await fetch("https://api.ship24.com/public/v1/trackers/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer apik_Qn3MusstRdw6IHTQZPjszWFwuTbTZO"
            },
            body: JSON.stringify({
                trackingNumber
            })
        });

        // Response Data
        const data: any = await response.json();
        const trackings: any = data.data.trackings[0];
        const shipment: any = trackings.shipment;
        const recipient: any = shipment.recipient;
        const events: any[] = trackings.events;

        // Curated Parcel Data
        const parcelRecipient: ParcelRecipient = {
            name: recipient.name,
            address: recipient.address,
            postCode: recipient.postCode,
            city: recipient.city,
            subdivision: recipient.subdivision
        };
        const parcelEvents: ParcelEvent[] = events.map((event: any) => {
            return {
                status: event.status,
                date: new Date(event.datetime),
                location: event.location
            };
        });
        const parcel: Parcel = new Parcel(trackingNumber, "TODO", parcelRecipient, parcelEvents);

        setParcel(parcel);
    }

    return (
        <Box
            sx={{
                border: "1px solid",
                borderRadius: "4px",
                padding: "1rem"
            }}
            mx={"auto"}
        >
            <Title
                sx={{
                    textAlign: "center",
                    margin: "1rem 0"
                }}
            >
                Universal Package Tracking
            </Title>

            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <TextInput
                    required={true}
                    label={"Tracking Number"}
                    placeholder={"123456789"}
                    {...form.getInputProps("trackingNumber")}
                />

                <Group position={"right"} mt={"md"}>
                    <Button type={"submit"}>Track</Button>
                </Group>
            </form>
        </Box>
    );
}