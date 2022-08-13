import type { HeaderLink } from "@lib/types/layout";

import {
    Menu,
    Center,
    Container,
    Group,
    Button,
    Burger,
    Paper,
    Header as MantineHeader,
    createStyles
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons";
import { NextRouter, useRouter } from "next/router";

import Link from "next/link";
import { logout, redirectToLogin } from "@lib/auth";
import { User } from "@supabase/gotrue-js";
import { removeCookies } from "cookies-next";

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
}));

type HeaderProps = {
    user?: User | null;
    links: HeaderLink[];
};

export default function Header({ user, links }: HeaderProps) {
    const router: NextRouter = useRouter();

    const { classes } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);

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
            <Link key={link.link} href={link.link} passHref={true}>
                <a
                    className={classes.link}
                >
                    {link.label}
                </a>
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
                        <Burger opened={opened} onClick={toggle} className={classes.burger} size={"sm"}/>
                        <h1>TrackItAll</h1>
                        {/* <MantineLogo size={28} /> */}
                    </Group>
                    <Group spacing={5} className={classes.links}>
                        {items}
                    </Group>
                    <Button
                        size={"md"}
                        radius={"xl"}
                        onClick={() => {
                            if (user) {
                                logout().then(data => router.push("/")).catch(console.error);
                            } else {
                                redirectToLogin(router).catch(console.error);
                            }
                        }}
                        sx={{ height: 30 }}
                    >
                        {user ? "Sign Out" : "Sign In"}
                    </Button>
                </Container>
            </Paper>
        </MantineHeader>
    );
}
