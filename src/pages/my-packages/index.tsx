import type { NextPage } from "next";

import { Box } from "@mantine/core";
import { NextRouter, useRouter } from "next/router";

import Layout from "@components/layout/Layout";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getUserServerSideProps } from "@lib/auth";
import { User } from "@supabase/gotrue-js";

type MyPackagesIndexProps = {
    user: User | null;
};

const MyPackagesIndex: NextPage<MyPackagesIndexProps> = ({ user }) => {
    const router: NextRouter = useRouter();

    return (
        <Layout>
            <Box
                sx={{
                    margin: "auto",
                    maxWidth: "750px",

                    "@media (max-width: 768px)": {
                        margin: "0px 10px"
                    }
                }}
            >
                <p>My Packages</p>
            </Box>
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<MyPackagesIndexProps>> {
    return getUserServerSideProps(context);
}

export default MyPackagesIndex;
