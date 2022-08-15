export type ParcelRecipient = {
    name: string | null;
    address: string | null;
    postCode: string | null;
    city: string | null;
    subdivision: string | null;
};

export type ParcelEvent = {
    status: string;
    date: Date;
    location: string;
};

export enum ParcelLatestStatus {
    IN_ROUTE = "IN_ROUTE",
    DELIVERED = "DELIVERED"
}
