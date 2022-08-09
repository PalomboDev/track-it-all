import { ApiError, Session, User } from "@supabase/gotrue-js";
import { supabase, supabaseAdmin } from "@lib/supabaseClient";
import { LoginFormValues, RegisterFormValues } from "@lib/types/auth";

export async function login(loginFormValues: LoginFormValues): Promise<User | null | void> {
    return supabase.auth.api.signInWithEmail(loginFormValues.email, loginFormValues.password, {
        redirectTo: "/",
    }).then(data => {
        if (data.error) {
            throw new Error(data.error.message);
        } else if (data.data?.user && data.data.refresh_token) {
            supabase.auth.setSession(data.data.refresh_token);
            return data.data.user;
        }

        return null;
    });
}

export async function register(registerFormValues: RegisterFormValues): Promise<User | null> {
    if (typeof window === "undefined") {
        return null;
    }

    if (supabaseAdmin) {
        return supabaseAdmin.auth.api.createUser({
            email: registerFormValues.email,
            password: registerFormValues.password,
            user_metadata: {
                firstName: registerFormValues.firstName,
                lastName: registerFormValues.lastName
            }
        }).then(data => {
            if (data.error) {
                throw new Error(data.error.message);
            } else if (data.user) {
                return data.user;
            }

            return null;
        });
    }

    return null;
}
