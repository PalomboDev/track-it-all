import { Box, Text } from "@mantine/core";
import { User } from "@supabase/gotrue-js";

import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCallbackUrl from "@hooks/useCallbackUrl";

type AlreadyLoggedInProps = {
    user: User;
};

export function AlreadyLoggedIn({ user }: AlreadyLoggedInProps) {
    const callbackUrl: string | undefined = useCallbackUrl();

    if (!callbackUrl) {
        return (
            <></>
        );
    }

    return (
        <Box>
            <Text>You are already logged in as {user.email}. Click <Link href={callbackUrl}>here</Link> to go back!</Text>
        </Box>
    );
}
