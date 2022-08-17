import type { NextPage } from "next";
import type { User } from "@prisma/client";

import { Box, Title } from "@mantine/core";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { redirectToLogin } from "@lib/auth";
import { NextRouter, useRouter } from "next/router";

import Layout from "@components/layout/Layout";
import MyPackagesGrid from "@components/my-packages/MyPackagesGrid";
import { getUserServerSideProps } from "@lib/auth-server";

type MyPackagesIndexProps = {
    user: User | null;
};

const MyPackagesIndex: NextPage<MyPackagesIndexProps> = ({ user }) => {
    const router: NextRouter = useRouter();

    if (!user) {
        redirectToLogin(router).catch(console.error);

        return (
            <Layout user={user}>
                <></>
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
