import type { HeaderLink } from "@lib/types";

import Header from "@components/layout/Header";
import Footer from "@components/layout/Footer";

type LayoutProps = {
    children: JSX.Element | JSX.Element[] | undefined;
};


export default function Layout({ children }: LayoutProps): JSX.Element {
    const links: HeaderLink[] = [
        {
            link: "/",
            label: "Home"
        },
        {
            link: "/about",
            label: "About"
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
