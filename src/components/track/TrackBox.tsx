import { TextInput, Button, Group, Title, Paper, Anchor, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";
import { NextRouter, useRouter } from "next/router";
import { sendErrorNotification } from "@lib/notifications";
import { mostRecentTrackedIdKey } from "@lib/constants";

import Parcel from "@lib/parcel/Parcel";
import Link from "next/link";
import { getParcel } from "@lib/parcel/handler";

type TrackBoxProps = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    parcel: Parcel | undefined;
    setParcel: (parcel: Parcel | undefined) => void;
};

export default function TrackBox({ isLoading, setIsLoading, parcel, setParcel }: TrackBoxProps): JSX.Element {
    const router: NextRouter = useRouter();

    const mostRecentTrackingNumber = useMemo<string | undefined>(() => {
        if (typeof window !== "undefined") {
            const trackingNumber: string | null = window.localStorage.getItem(mostRecentTrackedIdKey);

            if (trackingNumber && router.query.trackingNumber && trackingNumber !== router.query.trackingNumber) {
                return trackingNumber;
            }
        }
    }, [router.query.trackingNumber]);

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

            window.localStorage.setItem(mostRecentTrackedIdKey, newValues.trackingNumber);
        }
    }, [router.query.trackingNumber]);

    async function onSubmit(values: any): Promise<void> {
        const trackingNumber: string | undefined = values.trackingNumber;

        if (!trackingNumber) {
            return;
        }

        setIsLoading(true);

        function onError(error: Error): void {
            console.error(error);
            setIsLoading(false);
            sendErrorNotification(new Error("Check tracking number and try again."));
        }

        const parcel: Parcel | null = await getParcel(trackingNumber);

        if (parcel) {
            setParcel(parcel);
        } else {
            onError(new Error("Parcel not found."));
        }

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
                Track Any Package
            </Title>

            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <TextInput
                    required={true}
                    label={"Tracking Number"}
                    placeholder={"12345 67890 12345 67890"}
                    {...form.getInputProps("trackingNumber")}
                />

                {mostRecentTrackingNumber &&
                    <Link href={`/?trackingNumber=${mostRecentTrackingNumber}`} passHref={true}>
                        <Anchor
                            size={"sm"}
                            mt={"md"}
                            onClick={() => window.localStorage.removeItem(mostRecentTrackedIdKey)}
                        >
                            Previously Tracked: {mostRecentTrackingNumber}
                        </Anchor>
                    </Link>}

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
