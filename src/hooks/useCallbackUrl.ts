import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useCallbackUrl(): string | undefined {
    const router: NextRouter = useRouter();

    const [url, setUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const { callbackUrl } = router.query;

        if (callbackUrl) {
            setUrl(callbackUrl as string);
        } else {
            setUrl(undefined);
        }
    }, [router.query]);

    return url;
}
