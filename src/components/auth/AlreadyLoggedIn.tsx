import { Box, Text } from "@mantine/core";
import { User } from "@supabase/gotrue-js";

import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";

type AlreadyLoggedInProps = {
    user: User;
};

export function AlreadyLoggedIn({ user }: AlreadyLoggedInProps) {
    const router: NextRouter = useRouter();

    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        const { callbackUrl } = router.query;

        if (callbackUrl) {
            setUrl(callbackUrl as string);
        }
    }, [router.query]);

    if (!url) {
        return (
            <></>
        );
    }

    return (
        <Box>
            <Text>You are already logged in as {user.email}. Click <Link href={url}>here</Link> to go back!</Text>
        </Box>
    );
}
