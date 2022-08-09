import { Box, Text } from "@mantine/core";
import { User } from "@supabase/gotrue-js";

import Link from "next/link";

type AlreadyLoggedInProps = {
    user: User;
};

export function AlreadyLoggedIn({ user }: AlreadyLoggedInProps) {
    return (
        <Box>
            <Text>You are already logged in as {user.email}. Click <Link href={"/"}>here</Link> to go home!</Text>
        </Box>
    );
}
