import { NextRouter } from "next/router";

export async function redirectToLogin(router: NextRouter): Promise<boolean> {
    if (router.asPath.startsWith("/api/auth/signin")) {
        return false;
    }

    let callbackUrl: string = router.asPath ? `?callbackUrl=${router.asPath}` : "";

    if (callbackUrl.includes("/auth")) {
        callbackUrl = "";
    }

    return router.push(`/api/auth/signin`);
}
