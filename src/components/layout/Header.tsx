import type { HeaderLink } from "@lib/types/layout";

import {
    Box,
    Center,
    Container,
    Group,
    Button,
    Burger,
    Paper,
    Image,
    Menu,
    Header as MantineHeader,
    createStyles, MantineTheme, Title
} from "@mantine/core";
import { useDisclosure, useMediaQuery, useViewportSize } from "@mantine/hooks";
import { IconChevronDown, IconLogout, IconUserCircle } from "@tabler/icons";
import { NextRouter, useRouter } from "next/router";
import { logout, redirectToLogin } from "@lib/auth";
import { User } from "@supabase/gotrue-js";
import { sendSuccessNotification } from "@lib/notifications";
import { useMemo } from "react";

import emoji from "node-emoji";
import Link from "next/link";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkLabel: {
        marginRight: 5,
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

type HeaderProps = {
    user?: User | null;
    links: HeaderLink[];
};

export default function Header({ user, links }: HeaderProps) {
    const router: NextRouter = useRouter();

    const { width } = useViewportSize();
    const { classes } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);

    const isSmall = useMemo<boolean>(() => width < 769, [width]);
    const actionButtonDisplay = useMemo<string>(() => isSmall ? "none" : "inline-block", [isSmall]);

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger={"hover"} exitTransitionDuration={0}>
                    <Menu.Target>
                        <Link key={link.link} href={link.link} passHref={true}>
                            <a
                                className={classes.link}
                                onClick={(event) => event.preventDefault()}
                            >
                                <Center>
                                    <span className={classes.linkLabel}>{link.label}</span>
                                    <IconChevronDown size={12} stroke={1.5}/>
                                </Center>
                            </a>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.link} href={link.link} passHref={true} className={classes.link}>
                <Button
                    className={router.pathname === link.link ? classes.linkActive : ""}
                    size={"sm"}
                    color={"dark"}
                    variant={"subtle"}
                    leftIcon={link.icon}
                    sx={{
                        width: "auto",

                        "@media (max-width: 768px)": {
                            width: "100%"
                        }
                    }}
                >
                    {link.label}
                </Button>
            </Link>
        );
    });

    return (
        <MantineHeader height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={80}>
            <Paper shadow={"md"} radius={"xs"} p={"xl"}>
                <Container
                    className={classes.inner}
                    fluid={true}
                >
                    <Group>
                        <Menu shadow={"md"} width={200} opened={opened}>
                            <Menu.Target>
                                <Burger opened={opened} onClick={toggle} className={classes.burger} size={"sm"}/>
                            </Menu.Target>

                            <Menu.Dropdown className={classes.burger}>
                                {items}

                                {!user && <>
                                    <Menu.Divider/>
                                    <Button
                                        size={"sm"}
                                        color={"dark"}
                                        variant={"subtle"}
                                        leftIcon={<IconLogout/>}
                                        className={classes.link}
                                        sx={{
                                            width: "100%"
                                        }}
                                        onClick={() => {
                                            if (!user) {
                                                redirectToLogin(router).catch(console.error);
                                                toggle();
                                            }
                                        }}
                                    >
                                        Login
                                    </Button>
                                </>}

                                {user && <>
                                    <Menu.Divider/>
                                    <Button
                                        size={"sm"}
                                        color={"dark"}
                                        variant={"subtle"}
                                        leftIcon={<IconLogout/>}
                                        className={classes.link}
                                        sx={{
                                            width: "100%"
                                        }}
                                        onClick={() => {
                                            if (user) {
                                                logout().then(data => {
                                                    router.push("/").then(data => {
                                                        sendSuccessNotification("You have successfully logged out!", "", 5000);
                                                    }).catch(console.error);
                                                }).catch(console.error);
                                                toggle();
                                            }
                                        }}
                                    >
                                        Logout
                                    </Button>
                                    <Menu.Divider/>
                                    <Menu.Label>{user?.email}</Menu.Label>
                                </>}
                            </Menu.Dropdown>
                        </Menu>

                        <Title>{emoji.get("package")} TrackItAll</Title>
                    </Group>
                    <Group spacing={5} className={classes.links}>
                        {items}
                    </Group>

                    {!user && <Button
                        size={"md"}
                        radius={"xl"}
                        onClick={() => {
                            if (!user) {
                                redirectToLogin(router).catch(console.error);
                            }
                        }}
                        sx={{
                            height: 30,

                            "@media (max-width: 768px)": {
                                display: "none"
                            }
                        }}
                    >
                        Login
                    </Button>}

                    {user && <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button
                                size={"md"}
                                radius={"xl"}
                                sx={{
                                    height: 30,

                                    "@media (max-width: 768px)": {
                                        display: "none"
                                    }
                            }}
                            >
                                Profile
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>{user?.email}</Menu.Label>
                            <Menu.Divider/>
                            <Menu.Item
                                icon={<IconLogout size={14}/>}
                                onClick={() => {
                                    logout().then(data => {
                                        router.push("/").then(data => {
                                            sendSuccessNotification("You have successfully logged out!", "", 5000);
                                        }).catch(console.error);
                                    }).catch(console.error);
                                }}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>}
                </Container>
            </Paper>
        </MantineHeader>
    );
}
