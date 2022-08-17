import type { AppProps } from "next/app";

import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import Head from "next/head";

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

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
                <title>TrackItAll</title>
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
