import { Box, Button, Card, Skeleton, Text } from "@mantine/core";

export default function MyPackagesGridItemSkeleton(): JSX.Element {
    return (
        <Skeleton height={"100%"} width={"100%"}>
            <Card>
                <Text size={"lg"} weight={500}>_</Text>

                <Box mt={"sm"}>
                    <Text>_</Text>
                    <Text>_</Text>
                </Box>

                <Box>
                    <Text>_</Text>
                    <Text>_</Text>
                </Box>

                <Box>
                    <Button>_</Button>
                    <Button>_</Button>
                </Box>
            </Card>
        </Skeleton>
    );
}
