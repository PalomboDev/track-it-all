import {
    IconArrowBigUpLine,
    IconCircleCheck,
    IconCircleDot,
    IconLoader,
    IconRoad,
    IconTag,
    IconTruckDelivery
} from "@tabler/icons";

export function useStatusToIcon(status: string): JSX.Element {
    status = status.toLowerCase();

    if (status.includes("delivered")) {
        return <IconCircleCheck size={15}/>;
    } else if (status.includes("out for delivery")) {
        return <IconTruckDelivery size={15}/>;
    } else if (status.includes("in transit")) {
        return <IconRoad size={15}/>;
    } else if (status.includes("pickup")) {
        return <IconArrowBigUpLine size={15}/>;
    } else if (status.includes("processing")) {
        return <IconLoader size={15}/>;
    } else if (status.includes("created") && status.includes("label")) {
        return <IconTag size={15}/>;
    }

    return <IconCircleDot size={15}/>
}
