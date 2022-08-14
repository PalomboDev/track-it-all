import type { User } from "@supabase/gotrue-js";

import { useGetMyPackages } from "@hooks/useGetMyPackages";
import { Button, Box, Loader } from "@mantine/core";
import { IconCheck, IconCircleMinus, IconPlus } from "@tabler/icons";
import { useEffect, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { redirectToLogin } from "@lib/auth";
import { startTrackingMyPackage, stopTrackingMyPackage } from "@lib/parcel/handler";
import { sendErrorNotification, sendSuccessNotification } from "@lib/notifications";
import { NextRouter, useRouter } from "next/router";
import { useHover } from "@mantine/hooks";

import Parcel from "@lib/parcel/Parcel";

type SaveToMyPackagesButtonProps = {
    user?: User | null;
    parcel: Parcel;
};

export default function SaveToMyPackagesButton({ user, parcel }: SaveToMyPackagesButtonProps): JSX.Element {
    const router: NextRouter = useRouter();

    const { hovered, ref } = useHover();
    const { data, error, isLoading, reload } = useGetMyPackages(user?.id);

    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isDoingSomething, setIsDoingSomething] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            setIsSaved(data.some(p => p.trackingNumber === parcel.trackingNumber));
        }
    }, [data, error, isLoading, parcel]);

    async function onSaveToMyPackages(): Promise<void> {
        if (isDoingSomething) {
            return;
        }

        let requireLogin: boolean = true;

        if (user) {
            const refreshData = await supabase.auth.refreshSession();

            if (refreshData && refreshData.data && refreshData.data.access_token) {
                requireLogin = false;
            }
        }

        if (!user || requireLogin) {
            redirectToLogin(router).catch(console.error);
        } else {
            setIsDoingSomething(true);

            const data = await startTrackingMyPackage(user.id, parcel.trackingNumber);

            setIsDoingSomething(false);
            reload();

            if (data.error) {
                sendErrorNotification(new Error(data.error.message), 5000);
                return;
            }

            if (data.data) {
                sendSuccessNotification("You have started tracking this package!", "", 5000);
            } else {
                sendErrorNotification(new Error("Something went wrong"), 5000);
            }
        }
    }

    async function onRemoveFromMyPackages(): Promise<void> {
        if (isDoingSomething) {
            return;
        }

        setIsDoingSomething(true);

        const data = await stopTrackingMyPackage(parcel.trackingNumber);

        setIsDoingSomething(false);
        reload();

        if (data.error) {
            sendErrorNotification(new Error(data.error.message), 5000);
            return;
        }

        if (data.data) {
            sendSuccessNotification("You have stopped tracking this package!", "", 5000);
        } else {
            sendErrorNotification(new Error("Something went wrong"), 5000);
        }
    }

    if (isLoading || !data || error) {
        return (
            <Box ref={ref}></Box>
        );
    }

    if (isSaved) {
        if (hovered) {
            return (
                <Box
                    style={{
                        width: "fit-content",
                        margin: "auto"
                    }}
                    ref={ref}
                >
                    <Button
                        color={"red"}
                        mt={"1.2rem"}
                        disabled={isDoingSomething}
                        leftIcon={isDoingSomething ?
                            <Loader color={"white"} size={"sm"} variant={"oval"}/> : <IconCircleMinus/>}
                        onClick={onRemoveFromMyPackages}
                    >
                        Remove from My Packages
                    </Button>
                </Box>
            );
        } else {
            return (
                <Box
                    style={{
                        width: "fit-content",
                        margin: "auto"
                    }}
                    ref={ref}
                >
                    <Button
                        color={"green"}
                        mt={"1.2rem"}
                        disabled={isDoingSomething}
                        leftIcon={isDoingSomething ?
                            <Loader color={"white"} size={"sm"} variant={"oval"}/> : <IconCheck/>}
                    >
                        Saved To My packages
                    </Button>
                </Box>
            );
        }
    }

    return (
        <Box
            style={{
                width: "fit-content",
                margin: "auto"
            }}
            ref={ref}
        >
            <Button
                color={"orange"}
                mt={"1.2rem"}
                disabled={isDoingSomething}
                leftIcon={isDoingSomething ?
                    <Loader color={"white"} size={"sm"} variant={"oval"}/> : <IconPlus/>}
                onClick={onSaveToMyPackages}
            >
                Save To My Packages
            </Button>
        </Box>
    );
}
