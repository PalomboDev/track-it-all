import type { MyPackage } from "@prisma/client";

import { Box, Button, Card, Divider, Loader, Menu, Text, Tooltip } from "@mantine/core";
import { IconCircleMinus, IconEye, IconPencil, IconTool } from "@tabler/icons";

import { useState } from "react";
import { stopTrackingMyPackage } from "@lib/parcel/handler";
import { sendErrorNotification, sendSuccessNotification } from "@lib/notifications";
import { NextRouter, useRouter } from "next/router";

import moment, { Moment } from "moment/moment";

import EditNameModal from "@components/my-packages/EditNameModal";

type MyPackagesGridItemProps = {
    myPackage: MyPackage;
    reload: () => void;
};

export default function MyPackagesGridItem({ myPackage, reload }: MyPackagesGridItemProps): JSX.Element {
    const router: NextRouter = useRouter();

    const date: Moment = moment.utc(myPackage.insertedAt).local(true);

    const [isViewing, setIsViewing] = useState<boolean>(false);
    const [isModifying, setIsModifying] = useState<boolean>(false);
    const [isEditNameModalOpen, setIsEditNameModalOpen] = useState<boolean>(false);

    function handleView(): void {
        if (isViewing) {
            return;
        }

        setIsViewing(true);

        router.push("/?trackingNumber=" + myPackage.trackingNumber).then(data => {
            setIsViewing(false);
        }).catch(console.error);
    }

    function handleEditName(): void {
        if (isModifying) {
            return;
        }
    }

    function handleStopTracking(): void {
        if (isModifying) {
            return;
        }

        setIsModifying(true);

        stopTrackingMyPackage(myPackage.trackingNumber).then((data: any) => {
            if (data.error) {
                throw data.error;
            }

            setIsModifying(false);
            reload();

            if (data.data) {
                sendSuccessNotification("You have stopped tracking this package!", "", 5000);
            } else {
                throw new Error("Something went wrong");
            }
        }).catch(error => {
            console.error(error);
            sendErrorNotification(error, 5000);
        });
    }

    return (
        <Card
            key={myPackage.id}
            shadow={"sm"}
            p={"lg"}
            radius={"md"}
            withBorder={true}
            sx={{
                textAlign: "center"
            }}
        >
            <EditNameModal
                myPackage={myPackage}
                isEditNameModalOpen={isEditNameModalOpen}
                setIsEditNameModalOpen={setIsEditNameModalOpen}
                reload={reload}
            />

            <Text size={"lg"} weight={500}>
                {myPackage.name ?? myPackage.trackingNumber}
            </Text>

            <Divider
                color={"gray"}
                variant={"solid"}
            />

            <Box mt={"sm"}>
                <Text size={"sm"}>
                    Tracking Number:
                </Text>

                <Text size={"sm"} color={"dimmed"}>
                    {myPackage.trackingNumber}
                </Text>
            </Box>

            <Box>
                <Text size={"sm"}>
                    Started Tracking At:
                </Text>

                <Text size={"sm"} color={"dimmed"}>
                    {date.format("MMM D, YYYY h:mm A")}
                </Text>
            </Box>

            <Box
                mt={"sm"}
                sx={{
                    margin: "auto"
                }}
            >
                <Tooltip label={"View"}>
                    <Button
                        color={"primary"}
                        mr={"10px"}
                        variant={"light"}
                        disabled={isViewing || isModifying}
                        onClick={handleView}
                    >
                        {isViewing ? <Loader size={"xs"} variant={"oval"}/> : <IconEye size={"20px"}/>}
                    </Button>
                </Tooltip>

                <Menu shadow={"md"} width={200}>
                    <Menu.Target>
                        <Button
                            color={"grape"}
                            variant={"light"}
                            disabled={isViewing || isModifying}
                        >
                            {isModifying ? <Loader size={"xs"} variant={"oval"}/> : <IconTool size={"20px"}/>}
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            icon={<IconPencil size={"14px"}/>}
                            // disabled={isViewing || isModifying}
                            // onClick={handleStopTracking}
                            onClick={() => setIsEditNameModalOpen(true)}
                        >
                            Edit Name
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                            color={"red"}
                            icon={<IconCircleMinus size={"14px"}/>}
                            disabled={isViewing || isModifying}
                            onClick={handleStopTracking}
                        >
                            Stop Tracking
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Box>
        </Card>
    );
}
