import type { MyPackage } from "@prisma/client";

import { supabase } from "@lib/supabaseClient";
import { useState, useMemo, useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";

export type MyPackagesData = {
    data: MyPackage[] | null;
    error: PostgrestError | null;
    isLoading: boolean;
    reload: () => void;
};

export function useGetMyPackages(userId: string | undefined): MyPackagesData {
    const [myPackages, setMyPackages] = useState<MyPackage[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const myPackagesData = useMemo<MyPackagesData>(() => {
        return {
            data: myPackages,
            error,
            isLoading,
            reload
        };
    }, [myPackages, error, isLoading]);

    function reload() {
        if (userId) {
            supabase
                .from("MyPackage")
                .select("*")
                .eq("userId", userId)
                .then(data => {
                    if (data.error) {
                        setError(data.error);
                        setIsLoading(false);
                    } else if (data.data) {
                        setMyPackages(data.data);
                        setIsLoading(false);
                    } else {
                        setIsLoading(false);
                    }
                });
        }
    }

    useEffect(() => {
        reload();
    }, []);

    if (!userId) {
        return {
            data: null,
            error: null,
            isLoading: false,
            reload
        };
    }

    return myPackagesData;
}
