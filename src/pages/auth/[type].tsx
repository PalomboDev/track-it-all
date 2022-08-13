import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";

import { AuthFormType } from "@lib/types/auth";

import AuthForm from "@components/auth/AuthForm";
import { User } from "@supabase/gotrue-js";
import { getUserServerSideProps } from "@lib/auth";

type AuthProps = {
    user: User | null;
    type: AuthFormType;
};

const Auth: NextPage<AuthProps> = ({ user, type }: AuthProps) => {
    return <AuthForm user={user} type={type}/>;
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
