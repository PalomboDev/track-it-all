import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

import { supabase } from "@lib/supabaseClient";
import Parcel from "@lib/parcel/Parcel";
import { ParcelEvent, ParcelLatestStatus } from "@lib/types/parcel";

export async function getParcel(trackingNumber: string): Promise<Parcel | null> {
    const response: Response = await fetch("/api/package/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            trackingNumber
        })
    });

    if (response.ok) {
        // Response Data
        const data: any = await response.json();
        const parcel: Parcel = data.parcel as Parcel;

        return parcel;
    }

    return null;
}

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

export function getParcelLatestStatus(parcel: Parcel): ParcelLatestStatus {
    if (parcel.events.length > 0) {
        const latestEvent: ParcelEvent = parcel.events[0];
        const latestEventStatus: string = latestEvent.status.toLowerCase();
        const deliveredTerms: string[] = ["delivered", "arrived", "picked up"]

        for (let deliveredTerm of deliveredTerms) {
            if (latestEventStatus.includes(deliveredTerm)) {
                return ParcelLatestStatus.DELIVERED;
            }
        }
    }

    return ParcelLatestStatus.IN_ROUTE;
}

export function parcelLatestStatusToColor(status: ParcelLatestStatus): string {
    switch (status) {
        case ParcelLatestStatus.IN_ROUTE: {
            return "#FFF9DB";
        }
        case ParcelLatestStatus.DELIVERED: {
            return "#EBFBEE";
        }
        default: {
            return "#FFFFFF";
        }
    }
}
