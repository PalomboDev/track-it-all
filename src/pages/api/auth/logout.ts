import type { NextApiRequest, NextApiResponse } from "next";

import { ApiError } from "@supabase/gotrue-js";
import { deleteCookie, setCookie } from "cookies-next";
import { accessToken, refreshToken } from "@lib/constants";

type Data = {
    error: ApiError | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "POST") {
        res.status(405).json({
            error: {
                message: "Only POST method allowed!",
                status: 405
            }
        });
        return null;
    }

    deleteCookie(accessToken, {
        req,
        res
    });
    deleteCookie(refreshToken, {
        req,
        res
    });

    res.status(200).json({
        error: null
    });
}
