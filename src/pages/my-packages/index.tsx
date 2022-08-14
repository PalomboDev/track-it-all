import type { NextPage } from "next";

import { Box, Title } from "@mantine/core";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getUserServerSideProps } from "@lib/auth";
import { User } from "@supabase/gotrue-js";

import Layout from "@components/layout/Layout";
import MyPackagesTable from "@components/my-packages/MyPackagesTable";
import MyPackagesGrid from "@components/my-packages/MyPackagesGrid";

type MyPackagesIndexProps = {
    user: User | null;
};

const MyPackagesIndex: NextPage<MyPackagesIndexProps> = ({ user }) => {
    if (!user) {
        return (
            <Layout user={user}>
                <Box>No User Found</Box>
            </Layout>
        );
    }

    return (
        <Layout user={user}>
            <Title
                sx={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textAlign: "center"
                }}
            >
                My Packages
            </Title>

            <Box
                sx={{
                    maxWidth: "80%",
                    margin: "0 auto"
                }}
            >
                <MyPackagesGrid user={user}/>
            </Box>
        </Layout>

    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<MyPackagesIndexProps>> {
    return getUserServerSideProps(context);
}

export default MyPackagesIndex;
