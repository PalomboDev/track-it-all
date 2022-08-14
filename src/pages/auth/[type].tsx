import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import type { User } from "@supabase/gotrue-js";

import { AuthFormType } from "@lib/types/auth";
import { getUserServerSideProps } from "@lib/auth";

import AuthForm from "@components/auth/AuthForm";
import Layout from "@components/layout/Layout";

type AuthProps = {
    user: User | null;
    type: AuthFormType;
};

const Auth: NextPage<AuthProps> = ({ user, type }: AuthProps) => {
    return (
        <Layout>
            <AuthForm user={user} type={type}/>
        </Layout>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<AuthProps>> {
    const { type } = context.query;
    let authType: AuthFormType | undefined = undefined;

    if (typeof type === "string") {
        const typeString: string = type.toUpperCase();

        if (typeString === AuthFormType.LOGIN || typeString === AuthFormType.REGISTER) {
            authType = typeString as AuthFormType;

            return getUserServerSideProps(context, undefined, undefined, {
                type: authType
            });
        }
    }

    return {
        redirect: {
            destination: "/auth/login",
            permanent: false
        }
    }
}

export default Auth;
