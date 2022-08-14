import { FormErrors, FormValidateInput } from "@mantine/form/lib/types";

export enum AuthProvider {
    EMAIL_PASSWORD = "EMAIL_PASSWORD",
    GITHUB = "GITHUB",
}

export enum AuthFormType {
    LOGIN = "LOGIN",
    REGISTER = "REGISTER"
}

export type ChildAuthFormProps<T> = {
    values: T;
    setValues: (values: T) => void;
    errors: FormErrors;
};

export type LoginFormValues = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export const loginFormValuesValidation: FormValidateInput<LoginFormValues> = {
    email: (value) => (!value ? "Invalid Email" : (value.length > 0 ? null : "Invalid Email")),
    password: (value) => (!value ? "Invalid Password" : (value.length > 0 ? null : "Invalid Password")),
};

export const loginFormInitialValues: LoginFormValues = {
    email: "",
    password: "",
    rememberMe: false
};

export type RegisterFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmationPassword: string;
};

export const registerFormValuesValidation: FormValidateInput<RegisterFormValues> = {
    firstName: (value) => (!value ? "Invalid First Name" : (value.length > 0 ? null : "Invalid First Name")),
    lastName: (value) => (!value ? "Invalid Last Name" : (value.length > 0 ? null : "Invalid Last Name")),
    email: (value) => (!value ? "Invalid Email" : (value.length > 0 ? null : "Invalid Email")),
    password: (value) => (!value ? "Invalid Password" : (value.length > 0 ? null : "Invalid Password")),
    confirmationPassword: (value) => (!value ? "Invalid Confirmation Password" : (value.length > 0 ? null : "Invalid Confirmation Password"))
};

export const registerFormInitialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmationPassword: ""
};
