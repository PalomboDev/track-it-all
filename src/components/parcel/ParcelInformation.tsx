import { useEffect, useState } from "react";
import { ParcelEvent, ParcelRecipient } from "@lib/types/parcel";
import { Box, Container, Text, Timeline, SimpleGrid, Loader, Button } from "@mantine/core";
import { useStatusToIcon } from "@hooks/useStatusToIcon";
import { IconPlus } from "@tabler/icons";
import { SessionContext, useSession } from "@hooks/useSession";
import { NextRouter, useRouter } from "next/router";
import { supabase } from "@lib/supabaseClient";
import { redirectToLogin } from "@lib/auth";

import Parcel from "@lib/parcel/Parcel";
import { User } from "@supabase/gotrue-js";
import moment, { Moment } from "moment";

type ParcelInformationProps = {
    user?: User | null;
    parcel: Parcel;
};

export function ParcelInformation({ user, parcel }: ParcelInformationProps): JSX.Element {
    const router: NextRouter = useRouter();

    const [isDelivered, setIsDelivered] = useState<boolean>(false);
    const [isSavingToMyPackages, setIsSavingToMyPackages] = useState<boolean>(false);

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

    async function onSaveToMyPackages(): Promise<void> {
        if (isSavingToMyPackages) {
            return;
        }

        let requireLogin: boolean = true;

        if (user) {
            const refreshData = await supabase.auth.refreshSession();

            if (refreshData && refreshData.data && refreshData.data.access_token) {
                requireLogin = false;
            }
        }

        if (requireLogin) {
            redirectToLogin(router).catch(console.error);
        } else {
            setIsSavingToMyPackages(false);
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    margin: "auto",
                    textAlign: "center",
                    width: "100%"
                }}
            >
                <Button
                    color={"orange"}
                    mt={"1.2rem"}
                    type={"submit"}
                    disabled={isSavingToMyPackages}
                    leftIcon={isSavingToMyPackages ? <Loader
                        color={"white"}
                        size={"sm"}
                        variant={"oval"}
                    /> : <IconPlus/>}
                    onClick={onSaveToMyPackages}
                >
                    Save To My Packages
                </Button>
            </Box>

            <SimpleGrid
                cols={2}
                breakpoints={[
                    { maxWidth: 768, cols: 1, spacing: "sm" }
                ]}
            >
                <Box>
                    {/* Package Info */}
                    <Container
                        id={"info"}
                        sx={{
                            // borderBottom: "1px solid",
                            // borderColor: "gray.200",
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
                            // borderBottom: "1px solid",
                            // borderColor: "gray.200",
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
                </Box>

                {/* Events */}
                <Box>
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
                                const date: Moment = moment.utc(event.date).local(true);

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
                                            {date.format("MMM D, YYYY h:mm A")}
                                        </Text>
                                    </Timeline.Item>
                                )
                            })}
                        </Timeline>
                    </Container>
                </Box>
            </SimpleGrid>
        </Box>
    );
}
