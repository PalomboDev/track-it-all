import type { NextApiRequest, NextApiResponse } from "next";

import { ApiError, Session, User } from "@supabase/gotrue-js";
import { supabase } from "@lib/supabaseClient";
import { setCookie } from "cookies-next";
import { accessToken, refreshToken } from "@lib/constants";

type Data = {
    session: Session | null;
    error: ApiError | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "POST") {
        res.status(405).json({
            session: null,
            error: {
                message: "Only POST method allowed!",
                status: 405
            }
        });
        return null;
    }

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            session: null,
            error: {
                message: "All fields must be filled!",
                status: 400
            },
        });
        return null;
    }

    if (supabase) {
        const data = await supabase.auth.api.signInWithEmail(email, password, {
            redirectTo: "/",
        });

        if (data.error) {
            res.status(500).json({
                session: null,
                error: data.error
            });
            return null;
        }

        const session: Session | null = data.data;

        if (session && session.access_token && session.refresh_token) {
            setCookie(accessToken, session.access_token, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                sameSite: "strict"
            });

            setCookie(refreshToken, session.refresh_token, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                sameSite: "strict"
            });

            res.status(200).json({
                session: session,
                error: null
            });

            return session;
        } else {
            res.status(500).json({
                session: null,
                error: {
                    message: "Failed to login!",
                    status: 500
                }
            });
            return null;
        }
    }

    res.status(500).json({
        session: null,
        error: {
            message: "Something went wrong!",
            status: 500
        }
    });
}
