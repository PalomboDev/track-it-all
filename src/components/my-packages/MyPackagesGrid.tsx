import type { User } from "@supabase/gotrue-js";
import type { MyPackage } from "@prisma/client";

import { Table, Text, Card, Box, Tooltip, Group, Button, SimpleGrid, Divider, Loader } from "@mantine/core";
import { useGetMyPackages } from "@hooks/useGetMyPackages";

import moment, { Moment } from "moment/moment";
import MyPackagesGridItem from "@components/my-packages/MyPackagesGridItem";

type MyPackagesGridProps = {
    user: User;
};

export default function MyPackagesGrid({ user }: MyPackagesGridProps): JSX.Element {
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
                {data.sort((a, b) => {
                    return moment(a.insertedAt).isAfter(moment(b.insertedAt)) ? -1 : 1;
                }).map((myPackage: MyPackage) => {
                    return <MyPackagesGridItem
                        key={myPackage.id}
                        myPackage={myPackage}
                        reload={reload}
                    />
                })}
            </SimpleGrid>
        </Box>
    );
}
