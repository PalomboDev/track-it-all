import { ChildAuthFormProps, RegisterFormValues } from "@lib/types/auth";
import { TextInput, PasswordInput } from "@mantine/core";

export default function RegisterForm({ values, setValues, errors }: ChildAuthFormProps<RegisterFormValues>) {
    return (
        <>
            <TextInput
                label={"First Name"}
                name={"firstName"}
                value={values.firstName || ""}
                error={errors.firstName}
                onChange={(event) => setValues({ ...values, firstName: event.target.value })}
            />

            <TextInput
                label={"Last Name"}
                name={"lastName"}
                value={values.lastName || ""}
                error={errors.lastName}
                onChange={(event) => setValues({ ...values, lastName: event.target.value })}
            />

            <TextInput
                label={"Email"}
                name={"email"}
                value={values.email || ""}
                error={errors.email}
                onChange={(event) => setValues({ ...values, email: event.target.value })}
            />

            <PasswordInput
                label={"Password"}
                name={"password"}
                value={values.password || ""}
                error={errors.password}
                onChange={(event) => setValues({ ...values, password: event.target.value })}
            />

            <PasswordInput
                label={"Confirm Password"}
                name={"confirmationPassword"}
                value={values.confirmationPassword || ""}
                error={errors.confirmationPassword}
                onChange={(event) => setValues({ ...values, confirmationPassword: event.target.value })}
            />
        </>
    );
}
