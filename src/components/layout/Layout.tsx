import type { HeaderLink } from "@lib/types/layout";

import { User } from "@supabase/gotrue-js";

import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

type LayoutProps = {
    user?: User | null;
    children: JSX.Element | JSX.Element[] | undefined;
};


export default function Layout({ user, children }: LayoutProps): JSX.Element {
    const links: HeaderLink[] = [
        {
            link: "/",
            label: "Home"
        },
        {
            link: "/my-packages",
            label: "My Packages"
        }
    ];

    return (
        <>
            <header>
                <Header
                    user={user}
                    links={links}
                />
            </header>

            <main>
                {children}
            </main>

            <footer>
                <Footer />
            </footer>
        </>
    );
}
