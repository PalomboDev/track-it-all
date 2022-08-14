import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { supabase } from "@lib/supabaseClient";

export async function getMyPackages(userId: string): Promise<any> {
    return supabase
        .from("MyPackage")
        .select("*")
        .eq("userId", userId)
        .then(data => data);
}

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

export async function setMyPackageName(trackingNumber: string, name: string): Promise<PostgrestFilterBuilder<any>> {
    return supabase
        .from("MyPackage")
        .update({
            name
        })
        .eq("trackingNumber", trackingNumber);
}
