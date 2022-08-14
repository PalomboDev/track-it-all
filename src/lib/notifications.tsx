import { showNotification } from "@mantine/notifications";

export function sendSuccessNotification(title: string, message: string, autoClose?: number): void {
    showNotification({
        title: title,
        message: message,
        color: "white",
        autoClose: autoClose ?? 5000,
        disallowClose: false,
        styles: (theme) => ({
            root: {
                backgroundColor: theme.colors.green[6],
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

export function sendErrorNotification(error: Error, autoClose?: number): void {
    showNotification({
        title: "Something went wrong",
        message: error.message,
        color: "white",
        autoClose: autoClose ?? 5000,
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
