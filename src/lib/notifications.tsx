import { showNotification } from "@mantine/notifications";

export function sendErrorNotification(error: Error): void {
    showNotification({
        title: "Something went wrong",
        message: error.message,
        color: "white",
        autoClose: 10000,
        disallowClose: false,
        styles: (theme) => ({
            root: {
                backgroundColor: theme.colors.red[6],
                color: theme.white,

                '&::before': {
                    backgroundColor: theme.white
                },
            },
            title: {
                color: theme.white
            },
            description: {
                color: theme.white
            },
        })
    });
}
