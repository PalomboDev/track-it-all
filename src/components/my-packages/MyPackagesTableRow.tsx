import type { MyPackage } from "@prisma/client";

import { Menu, Button, Loader } from "@mantine/core";
import { IconEye, IconTool, IconCircleMinus } from "@tabler/icons";
import { useState } from "react";
import { stopTrackingMyPackage } from "@lib/parcel/handler";
import { sendErrorNotification, sendSuccessNotification } from "@lib/notifications";
import { NextRouter, useRouter } from "next/router";

type MyPackagesTableRowProps = {
    myPackage: MyPackage;
    reload: () => void;
};

export default function MyPackagesTableRow({ myPackage, reload }: MyPackagesTableRowProps): JSX.Element {
    const router: NextRouter = useRouter();

    const [isViewing, setIsViewing] = useState<boolean>(false);
    const [isModifying, setIsModifying] = useState<boolean>(false);

    function handleView(): void {
        if (isViewing) {
            return;
        }

        setIsViewing(true);

        router.push("/?trackingNumber=" + myPackage.trackingNumber).then(data => {
            setIsViewing(false);
        }).catch(console.error);
    }

    // Modify
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
                sendSuccessNotification("Success", "You have stopped tracking this package!", 5000);
            } else {
                throw new Error("Something went wrong");
            }
        }).catch(error => {
            console.error(error);
            sendErrorNotification(error, 5000);
        });
    }

    return (
        <tr>
            <td>This is a test name</td>
            <td>{myPackage.trackingNumber}</td>
            <td>
                <Button
                    color={"primary"}
                    mr={"10px"}
                    leftIcon={isViewing ? <Loader size={"xs"} variant={"oval"}/> : <IconEye size={"20px"}/>}
                    disabled={isViewing || isModifying}
                    onClick={handleView}
                >
                    View
                </Button>

                <Menu shadow={"md"} width={200}>
                    <Menu.Target>
                        <Button
                            color={"grape"}
                            leftIcon={isModifying ? <Loader size={"xs"} variant={"oval"}/> : <IconTool size={"20px"}/>}
                            disabled={isViewing || isModifying}
                        >
                            Modify
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
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
            </td>
        </tr>
    );
}
