import type { User, MyPackage } from "@prisma/client";

import { Text, Box, SimpleGrid, Loader } from "@mantine/core";
import { useGetMyPackages } from "@hooks/useGetMyPackages";

import moment, { Moment } from "moment/moment";
import MyPackagesGridItem from "@components/my-packages/MyPackagesGridItem";
import MyPackagesGridItemSkeleton from "@components/my-packages/MyPackagesGridItemSkeleton";

type MyPackagesGridProps = {
    user: User;
};

export default function MyPackagesGrid({ user }: MyPackagesGridProps): JSX.Element {
    const { data, error, isLoading, reload } = useGetMyPackages(user.id);

    if (isLoading) {
        return (
            <SimpleGrid
                cols={4}
                spacing={"lg"}
                breakpoints={[
                    { maxWidth: 1500, cols: 3, spacing: "sm" },
                    { maxWidth: 1100, cols: 2, spacing: "sm" },
                    { maxWidth: 768, cols: 1, spacing: "sm" }
                ]}
            >
                {Array(9).fill(0).map((_, index) => (
                    <MyPackagesGridItemSkeleton key={index}/>
                ))}
            </SimpleGrid>
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
            {data && data.length === 0 && <Text
                sx={{
                    textAlign: "center"
                }}
            >
                You aren't tracking any packages.
            </Text>}

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
