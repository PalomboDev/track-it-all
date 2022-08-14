import type { User } from "@supabase/gotrue-js";
import type { MyPackage } from "@prisma/client";

import { Table, Text, Card, Box, Tooltip, Group, Button, SimpleGrid, Divider, Loader } from "@mantine/core";
import { useGetMyPackages } from "@hooks/useGetMyPackages";

import MyPackagesTableRow from "@components/my-packages/MyPackagesTableRow";
import { IconEye, IconTool } from "@tabler/icons";
import moment from "moment";
import { Moment } from "moment/moment";

type MyPackagesTableProps = {
    user: User;
};

export default function MyPackagesTable({ user }: MyPackagesTableProps): JSX.Element {
    const { data, error, isLoading, reload } = useGetMyPackages(user.id);

    if (isLoading) {
        return (
            <Text>Loading...</Text>
        );
    }

    if (error) {
        return (
            <Text>Error: {error.message}</Text>
        );
    }

    if (!data) {
        return (
            <Text>Something went wrong!</Text>
        );
    }

    return (
        <Box>
            <SimpleGrid
                cols={4}
                spacing={"lg"}
                breakpoints={[
                    { maxWidth: 1500, cols: 3, spacing: "sm" },
                    { maxWidth: 1100, cols: 2, spacing: "sm" },
                    { maxWidth: 768, cols: 1, spacing: "sm" }
                ]}
            >
                {data.map((myPackage: MyPackage) => {
                    const date: Moment = moment.utc(new Date()).local(true);

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
                            <Text size={"lg"} weight={500}>
                                {myPackage.trackingNumber}
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
                                    Last Updated:
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
                                        variant={"light"}
                                        mr={"10px"}
                                        // leftIcon={<IconEye size={"20px"}/>}
                                    >
                                        <IconEye size={"20px"}/>
                                        {/*View*/}
                                    </Button>
                                </Tooltip>

                                <Tooltip label={"Modify"}>
                                    <Button
                                        color={"grape"}
                                        variant={"light"}
                                        // leftIcon={<IconTool size={"20px"}/>}
                                    >
                                        <IconTool size={"20px"}/>
                                    </Button>
                                </Tooltip>
                            </Box>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </Box>
    );

    // return (
    //     <Table striped={true}>
    //         <thead>
    //             <tr>
    //                 <th>Name</th>
    //                 <th>Tracking Number</th>
    //                 <th>Actions</th>
    //             </tr>
    //         </thead>
    //
    //         <tbody>
    //             {data.map((myPackage: MyPackage) => {
    //                 return <MyPackagesTableRow
    //                     key={myPackage.id}
    //                     myPackage={myPackage}
    //                     reload={reload}
    //                 />;
    //             })}
    //         </tbody>
    //     </Table>
    // );
}
