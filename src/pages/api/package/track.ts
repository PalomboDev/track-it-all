import type { NextApiRequest, NextApiResponse } from "next";

import { ApiError } from "@supabase/gotrue-js";

import Parcel from "@lib/parcel/Parcel";
import { ParcelEvent, ParcelRecipient } from "@lib/types/parcel";

type Data = {
    parcel: Parcel | null;
    error: ApiError | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== "POST") {
        res.status(405).json({
            parcel: null,
            error: {
                message: "Only POST method allowed!",
                status: 405
            }
        });
        return;
    }

    const { trackingNumber } = req.body;

    if (!trackingNumber) {
        res.status(400).json({
            parcel: null,
            error: {
                message: "Missing tracking number!",
                status: 400
            }
        });
        return;
    }

    const response: Response = await fetch("https://api.ship24.com/public/v1/trackers/track", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.SHIP24_API_KEY
        },
        body: JSON.stringify({
            trackingNumber
        })
    });

    if (!response.ok) {
        res.status(response.status).json({
            parcel: null,
            error: {
                message: response.statusText,
                status: response.status
            }
        });
        return;
    }

    try {
        // Response Data
        const data: any = await response.json();
        const trackings: any = data.data.trackings[0];
        const shipment: any = trackings.shipment;
        const recipient: any = shipment.recipient;
        const events: any[] = trackings.events;

        // Curated Parcel Data
        const parcelRecipient: ParcelRecipient = {
            name: recipient.name,
            address: recipient.address,
            postCode: recipient.postCode,
            city: recipient.city,
            subdivision: recipient.subdivision
        };
        const parcelEvents: ParcelEvent[] = events.map((event: any) => {
            return {
                status: event.status,
                date: new Date(event.datetime),
                location: event.location
            };
        });
        const parcel: Parcel = new Parcel(trackingNumber, "FedMex", parcelRecipient, parcelEvents);

        res.status(200).json({
            parcel: {
                trackingNumber: parcel.trackingNumber,
                provider: parcel.provider,
                recipient: parcel.recipient,
                events: parcel.events
            } as Parcel,
            error: null
        });
    } catch (error: any) {
        res.status(500).json({
            parcel: null,
            error: {
                message: "Something went wrong on the server's end!",
                status: 500
            }
        });
    }
}
