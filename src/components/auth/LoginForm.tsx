import { ChildAuthFormProps, LoginFormValues } from "@lib/types/auth";
import { TextInput, PasswordInput, Input, Checkbox } from "@mantine/core";

export default function LoginForm({ values, setValues, errors }: ChildAuthFormProps<LoginFormValues>) {
    return (
        <>
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

            {/*<Input.Wrapper*/}
            {/*    label={"Remember Me"}*/}
            {/*>*/}
            {/*    <Checkbox*/}
            {/*        name={"rememberMe"}*/}
            {/*        checked={values.rememberMe || false}*/}
            {/*        onChange={(event: any) => setValues({ ...values, rememberMe: event.target.checked })}*/}
            {/*    />*/}
            {/*</Input.Wrapper>*/}
        </>
    );
}
