import { createContext, useContext } from "react";
import { Session } from "@supabase/gotrue-js";

export type SessionContext = {
    session: Session | null;
}

export const CreatedSessionContext = createContext<SessionContext>({
    session: null
});

export const useSession = () => {
    const context: SessionContext = useContext(CreatedSessionContext);

    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }

    return context;
}
