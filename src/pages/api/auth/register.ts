import type { NextApiRequest, NextApiResponse } from "next";

import { ApiError, User } from "@supabase/gotrue-js";
import { supabaseAdmin } from "@lib/supabaseClient";

type Data = {
    user: User | null;
    error: ApiError | null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "POST") {
        res.status(405).json({
            user: null,
            error: {
                message: "Only POST method allowed!",
                status: 405
            }
        });
        return;
    }

    const { firstName, lastName, email, password, confirmationPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmationPassword) {
        res.status(400).json({
            user: null,
            error: {
                message: "All fields must be filled!",
                status: 400
            }
        });
        return;
    }

    if (password !== confirmationPassword) {
        res.status(400).json({
            user: null,
            error: {
                message: "Passwords must match!",
                status: 400
            }
        });
        return;
    }

    if (supabaseAdmin) {
        supabaseAdmin.auth.api.createUser({
            email,
            password,
            user_metadata: {
                firstName,
                lastName
            }
        }).then(data => {
            if (data.error) {
                res.status(500).json({
                    user: null,
                    error: data.error
                });
            } else if (data.user) {
                res.status(200).json({
                    user: data.user,
                    error: null
                });
            } else {
                res.status(500).json({
                    user: null,
                    error: {
                        message: "Unknown error!",
                        status: 500
                    }
                });
            }
        });
    }
}
