import type { MyPackage } from "@prisma/client";

import { Box, Text, TextInput, Group, Button, Modal, Loader } from "@mantine/core";
import { useForm } from "@mantine/form";
import { setMyPackageName } from "@lib/parcel/handler";
import { sendErrorNotification, sendSuccessNotification } from "@lib/notifications";
import { useState } from "react";

type EditNameModalProps = {
    myPackage: MyPackage;
    isEditNameModalOpen: boolean;
    setIsEditNameModalOpen: (isEditNameModalOpen: boolean) => void;
    reload: () => void;
};

export default function EditNameModal({ myPackage, isEditNameModalOpen, setIsEditNameModalOpen, reload }: EditNameModalProps): JSX.Element {
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            name: ""
        },
        validate: {
            name: (value) => value.length > 2 ? null : "Invalid Name (Must be greater than 2 characters)"
        }
    });

    async function handleSubmit(values: any): Promise<void> {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        setMyPackageName(myPackage.trackingNumber, values.name).then((data: any) => {
            if (data.error) {
                throw data.error;
            }

            setIsEditNameModalOpen(false);
            sendSuccessNotification("Package Name Updated", "", 5000);
            setIsSaving(false);

            form.reset();
            reload();
        }).catch(error => {
            console.error(error);
            form.reset();
            sendErrorNotification(error, 5000);
            setIsSaving(false);
        });
    }

    function handleCancel(): void {
        if (isSaving) {
            return;
        }

        form.reset();
        setIsEditNameModalOpen(false);
    }

    return (
        <Modal
            opened={isEditNameModalOpen}
            onClose={() => setIsEditNameModalOpen(false)}
            title={<Text size={"xl"} weight={500}>{myPackage.trackingNumber}</Text>}
            withCloseButton={true}
            transition={"pop"}
            transitionDuration={500}
            transitionTimingFunction={"ease"}
        >
            <Text>Current Name: {myPackage.name ?? myPackage.trackingNumber}</Text>

            <Box mt={"10px"}>
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <TextInput
                        label={"New Name"}
                        placeholder={myPackage.trackingNumber}
                        required={true}
                        {...form.getInputProps("name")}
                    />

                    <Group position={"right"} mt={"md"}>
                        <Button
                            color={"green"}
                            type={"submit"}
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader size={"xs"} variant={"oval"}/> : "Save"}
                        </Button>
                        <Button
                            color={"red"}
                            disabled={isSaving}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Group>
                </form>
            </Box>
        </Modal>
    );
}
