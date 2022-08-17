import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { User } from "@prisma/client";

import { Session } from "next-auth";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import { prisma } from "@lib/prisma";
import { supabase } from "@lib/supabaseClient";

export async function getUserServerSideProps<T>(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T | { user: User | null }>> {
    const session: Session | null = await getServerSession(context.req, context.res, authOptions);

    if (!session || !session.user) {
        return {
            props: {
                user: null
            }
        }
    }

    const user = await supabase
        .from("User")
        .select("*")
        .eq("email", session.user.email)
        .single();

    if (!user || user.error || !user.data) {
        return {
            props: {
                user: null
            }
        }
    }

    return {
        props: {
            user: user.data as User
        }
    }
}
