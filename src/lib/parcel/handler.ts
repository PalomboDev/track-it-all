import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { supabase } from "@lib/supabaseClient";

export async function startTrackingMyPackage(userId: string, trackingNumber: string): Promise<PostgrestFilterBuilder<any>> {
    return supabase
        .from("MyPackage")
        .insert({
            trackingNumber,
            userId
        });
}

export async function stopTrackingMyPackage(trackingNumber: string): Promise<PostgrestFilterBuilder<any>> {
    return supabase
        .from("MyPackage")
        .delete()
        .eq("trackingNumber", trackingNumber);
}
