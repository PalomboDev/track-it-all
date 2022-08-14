import { ApiError, Session, User } from "@supabase/gotrue-js";
import { supabase, supabaseAdmin } from "@lib/supabaseClient";
import { LoginFormValues, RegisterFormValues } from "@lib/types/auth";
import { NextRouter } from "next/router";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { refreshToken, accessToken } from "@lib/constants";
import { deleteCookie } from "cookies-next";
import { sendSuccessNotification } from "@lib/notifications";

export async function login(loginFormValues: LoginFormValues, router?: NextRouter): Promise<{ user: User | null; error: Error | null } | null | void> {
    const response: Response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginFormValues),
    });

    const data = await response.json();

    if (data.error) {
        return {
            user: null,
            error: new Error(data.error.message)
        };
    }

    if (response.status === 200) {
        const session: Session = data.session;

        if (session && session.access_token && session.refresh_token) {
            const newSession = await supabase.auth.setSession(session.refresh_token);

            if (newSession) {
                if (newSession.error) {
                    return {
                        user: null,
                        error: new Error(newSession.error.message)
                    };
                }

                if (newSession.session?.access_token) {
                    supabase.auth.setAuth(newSession.session.access_token);

                    if (newSession.session && newSession.session.refresh_token && newSession.session.user) {
                        if (router) {
                            const { callbackUrl } = router.query;

                            if (callbackUrl) {
                                router.push(callbackUrl as string).then(data => {
                                    sendSuccessNotification("You have successfully logged in!", "", 5000);
                                }).catch(console.error);
                            }
                        }

                        return {
                            user: session.user,
                            error: null
                        };
                    }
                }
            }
        }
    }

    return null;
}

export async function register(registerFormValues: RegisterFormValues): Promise<User | null> {
    if (typeof window === "undefined") {
        return null;
    }

    if (supabaseAdmin) {
        return supabaseAdmin.auth.api.createUser({
            email: registerFormValues.email,
            password: registerFormValues.password,
            user_metadata: {
                firstName: registerFormValues.firstName,
                lastName: registerFormValues.lastName
            }
        }).then(data => {
            if (data.error) {
                throw new Error(data.error.message);
            } else if (data.user) {
                return data.user;
            }

            return null;
        });
    }

    return null;
}

export async function logout(): Promise<{ error: ApiError | null }> {
    if (typeof window === "undefined") {
        return {
            error: null
        };
    }

    const response: Response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const data = await response.json();

        console.error(data.error);
    }

    // Should never have these cookies set, but just in case...
    deleteCookie(accessToken);
    deleteCookie(refreshToken);

    if (supabase) {
        return await supabase.auth.signOut();
    }

    return {
        error: null
    };
}

export async function redirectToLogin(router: NextRouter): Promise<boolean> {
    if (router.asPath.startsWith("/auth/login")) {
        return false;
    }

    let callbackUrl: string = router.asPath ? `?callbackUrl=${router.asPath}` : "";

    return router.push(`/auth/login${callbackUrl}`);
}

export async function getUserServerSideProps(context: GetServerSidePropsContext, redirect?: string, source?: string, props?: any): Promise<GetServerSidePropsResult<any>> {
    const data = await supabase.auth.api.getUserByCookie(context.req);

    if (!data.error && data.user) {
        return {
            props: {
                ...props,
                user: data.user
            }
        };
    }

    return {
        props: {
            ...props,
            user: null
        }
    }
}
