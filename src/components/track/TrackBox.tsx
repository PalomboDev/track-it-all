import type { ParcelEvent, ParcelRecipient } from "@lib/types";

import { TextInput, Button, Group, Box, Title, Loader, Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

import Parcel from "@lib/parcel/Parcel";
import { NextRouter, useRouter } from "next/router";

type TrackBoxProps = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    parcel: Parcel | undefined;
    setParcel: (parcel: Parcel | undefined) => void;
};

export default function TrackBox({ isLoading, setIsLoading, parcel, setParcel }: TrackBoxProps): JSX.Element {
    const router: NextRouter = useRouter();

    const form = useForm({
        initialValues: {
            trackingNumber: ""
        },
        validate: {
            trackingNumber: (value) => (value.length > 0 ? null : "Invalid tracking number")
        }
    });

    useEffect(() => {
        if (router.query.trackingNumber) {
            const newValues: any = {
                trackingNumber: router.query.trackingNumber
            };

            form.setValues(newValues);
            onSubmit(newValues).catch(console.error);
        }
    }, [router.query.trackingNumber]);

    async function onSubmit(values: any): Promise<void> {
        const trackingNumber: string | undefined = values.trackingNumber;

        if (!trackingNumber) {
            return;
        }

        setIsLoading(true);

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
        const parcel: Parcel = new Parcel(trackingNumber, "FedMex", parcelRecipient, parcelEvents);

        setParcel(parcel);
        setIsLoading(false);
    }

    return (
        <Paper
            shadow={"lg"}
            p={"xl"}
            withBorder={true}
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
                    <Button
                        disabled={isLoading}
                        type={"submit"}
                        sx={{
                            width: "100%"
                        }}
                    >
                        {isLoading ? <Loader size={"xs"} variant={"dots"}/> : "Track"}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}
