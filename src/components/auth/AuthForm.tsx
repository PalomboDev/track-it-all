import {
    AuthFormType,
    loginFormInitialValues,
    LoginFormValues,
    loginFormValuesValidation,
    registerFormInitialValues,
    RegisterFormValues,
    registerFormValuesValidation
} from "@lib/types/auth";
import { Box, Button, Title, Text, Anchor, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { AlreadyLoggedIn } from "@components/auth/AlreadyLoggedIn";
import { login } from "@lib/auth";
import { sendErrorNotification } from "@lib/notifications";
import { NextRouter, useRouter } from "next/router";
import { User } from "@supabase/gotrue-js";

import Link from "next/link";
import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";

type AuthFormProps = {
    user?: User | null;
    type: AuthFormType;
};

export default function AuthForm({ user, type }: AuthFormProps) {
    const router: NextRouter = useRouter();

    const [initialValues, setInitialValues] = useState<any>({});
    const [validate, setValidate] = useState<any>(null);
    const [headerText, setHeaderText] = useState<string>("");
    const [subHeaderText, setSubHeaderText] = useState<JSX.Element | undefined>(undefined);
    const [buttonText, setButtonText] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<any>({
        initialValues,
        validate
    });

    useEffect(() => {
        switch (type) {
            case AuthFormType.LOGIN: {
                setInitialValues(loginFormInitialValues);
                setValidate(loginFormValuesValidation);
                setHeaderText("Login");
                setSubHeaderText(<Text>Need an account? Create one <Link href={"/auth/register"} passHref={true}><Anchor>here</Anchor></Link>.</Text>)
                setButtonText("Login");
                break;
            }
            case AuthFormType.REGISTER: {
                setInitialValues(registerFormInitialValues);
                setValidate(registerFormValuesValidation);
                setHeaderText("Register");
                setSubHeaderText(<Text>Already have an account? Login <Link href={"/auth/login"} passHref={true}><Anchor>here</Anchor></Link>.</Text>)
                setButtonText("Register");
                break;
            }
        }
    }, [type]);

    async function onSubmit(): Promise<void> {
        let values: LoginFormValues | RegisterFormValues = form.values;
        const { hasErrors } = await form.validate();

        if (hasErrors || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        function handleError(error: Error): void {
            console.error(error);
            setIsSubmitting(false);
            sendErrorNotification(error);
        }

        switch (type) {
            case AuthFormType.LOGIN: {
                let loginFormValues = values as LoginFormValues;

                login(loginFormValues, router).then(data => {
                    setIsSubmitting(false);

                    if (data && data.error) {
                        handleError(data.error);
                        return;
                    }

                    if (data && data.user) {
                        return;
                    }

                    throw new Error("Refresh and try again!");
                }).catch(handleError);
                break;
            }
            case AuthFormType.REGISTER: {
                let registerFormValues = values as RegisterFormValues;

                fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(registerFormValues)
                }).then(data => data.json()).then(data => {
                    setIsSubmitting(false);

                    if (data.error) {
                        throw new Error(data.error.message);
                    } else if (data.user) {
                        router.push("/").catch(console.error);
                    }
                }).catch(handleError);
                break;
            }
        }
    }

    if (user) {
        return <AlreadyLoggedIn user={user}/>;
    }

    return (
        <Box
            sx={{
                margin: "auto",
                maxWidth: "750px",
                padding: "20px"
            }}
        >
            <Box
                sx={{
                    textAlign: "center"
                }}
            >
                <Title>{headerText}</Title>
                {subHeaderText}
            </Box>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit().catch(console.error);
                }}
            >
                {type === AuthFormType.LOGIN &&
                    <LoginForm
                        values={form.values}
                        setValues={form.setValues}
                        errors={form.errors}
                    />}

                {type === AuthFormType.REGISTER &&
                    <RegisterForm
                        values={form.values}
                        setValues={form.setValues}
                        errors={form.errors}
                    />}

                <Button
                    type={"submit"}
                    disabled={isSubmitting}
                    sx={{
                        marginTop: "20px"
                    }}
                >
                    {isSubmitting ? <Loader size={"sm"} variant={"oval"}/> : buttonText}
                </Button>
            </form>
        </Box>
    );
}

AuthForm.defaultProps = {
    type: AuthFormType.LOGIN
};
