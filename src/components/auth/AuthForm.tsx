import {
    AuthFormType,
    loginFormInitialValues,
    LoginFormValues,
    loginFormValuesValidation,
    registerFormInitialValues,
    RegisterFormValues,
    registerFormValuesValidation
} from "@lib/types/auth";
import { Box, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

import LoginForm from "@components/auth/LoginForm";
import RegisterForm from "@components/auth/RegisterForm";

type AuthFormProps = {
    type: AuthFormType;
};

export default function AuthForm({ type }: AuthFormProps) {
    const [initialValues, setInitialValues] = useState<any>({});
    const [validate, setValidate] = useState<any>(null);
    const [buttonText, setButtonText] = useState<string>("");

    const form = useForm<any>({
        initialValues,
        validate
    });

    useEffect(() => {
        switch (type) {
            case AuthFormType.LOGIN: {
                setInitialValues(loginFormInitialValues);
                setValidate(loginFormValuesValidation);
                setButtonText("Login");
                break;
            }
            case AuthFormType.REGISTER: {
                setInitialValues(registerFormInitialValues);
                setValidate(registerFormValuesValidation);
                setButtonText("Register");
                break;
            }
        }
    }, []);

    async function onSubmit(): Promise<void> {
        let values: LoginFormValues | RegisterFormValues = form.values;
        const { hasErrors } = await form.validate();

        if (hasErrors) {
            return;
        }

        switch (type) {
            case AuthFormType.LOGIN: {
                let loginFormValues = values as LoginFormValues;
                console.log("Login");
                break;
            }
            case AuthFormType.REGISTER: {
                let registerFormValue = values as RegisterFormValues;
                console.log("Register");
                break;
            }
        }
    }

    return (
        <Box
            sx={{
                margin: "auto",
                maxWidth: "750px",
                padding: "20px"
            }}
        >
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
                    sx={{
                        marginTop: "20px"
                    }}
                >
                    {buttonText}
                </Button>
            </form>
        </Box>
    );
}

AuthForm.defaultProps = {
    type: AuthFormType.LOGIN
};
