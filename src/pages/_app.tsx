import type { AppProps } from "next/app";

import { MantineProvider } from "@mantine/core";
import { CreatedSessionContext } from "@hooks/useSession";
import { supabase } from "@lib/supabaseClient";
import { Session, User } from "@supabase/gotrue-js";
import { useState, useEffect } from "react";
import { LoadingPage } from "@components/layout/LoadingPage";
import { NotificationsProvider } from "@mantine/notifications";

import Head from "next/head";

export default function App(props: AppProps) {
    const { Component, pageProps } = props;
    // const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
    // const [session, setSession] = useState<Session | null>(null);
    // const [user, setUser] = useState<User | null>(null);
    //
    // function loadUserError(): void {
    //     setSession(null);
    //     setUser(null);
    //
    //     window.localStorage.removeItem("supabase.auth.token");
    // }
    //
    // useEffect(() => {
    //     setSession(supabase.auth.session());
    //
    //     supabase.auth.onAuthStateChange((_event, session) => {
    //         setSession(session);
    //     });
    // }, []);
    //
    // useEffect(() => {
    //     if (isSessionLoading) {
    //         setIsSessionLoading(false);
    //     }
    //
    //     if (session) {
    //         supabase.auth.api.getUser(session.access_token).then((data) => {
    //             if (data.error) {
    //                 loadUserError();
    //             } else if (data.user) {
    //                 setUser(data.user);
    //             }
    //         }).catch((error) => {
    //             console.error(error);
    //             loadUserError();
    //         });
    //     }
    // }, [session]);
    //
    // if (isSessionLoading || (session && !user)) {
    //     return <LoadingPage/>;
    // }

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                margin: "0",
                padding: "0"
            }}
        >
            <Head>
                <title>Page title</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>

            <MantineProvider
                withGlobalStyles={true}
                withNormalizeCSS={true}
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: "light"
                }}
            >
                <NotificationsProvider position={"top-right"}>
                    <Component {...pageProps} />
                    {/*<CreatedSessionContext.Provider value={{ session }}>*/}
                    {/*    <Component {...pageProps} />*/}
                    {/*</CreatedSessionContext.Provider>*/}
                </NotificationsProvider>
            </MantineProvider>
        </div>
    );
}
