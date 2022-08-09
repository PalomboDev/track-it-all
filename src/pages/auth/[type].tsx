import type { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";

import { AuthFormType } from "@lib/types/auth";

import AuthForm from "@components/auth/AuthForm";

type AuthProps = {
    type: AuthFormType;
};

const Auth: NextPage<AuthProps> = ({ type }: AuthProps) => {
    return <AuthForm type={type}/>;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<AuthProps>> {
    const { type } = context.query;
    let authType: AuthFormType | undefined = undefined;

    if (typeof type === "string") {
        const typeString: string = type.toUpperCase();

        if (typeString === AuthFormType.LOGIN || typeString === AuthFormType.REGISTER) {
            authType = typeString as AuthFormType;

            return {
                props: {
                    type: authType
                }
            }
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
