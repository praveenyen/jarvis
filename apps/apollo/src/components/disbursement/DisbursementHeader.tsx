import { Box, Center, Divider, Paper, SegmentedControl, SimpleGrid, Title } from "@mantine/core";

type props = {
    activeTab:string;
    setActiveTab: (data:string)=>void;
}

export default function DisbursementHeader({ activeTab, setActiveTab }:props) {


    return (
        <Box>
            <SimpleGrid cols={3} spacing="sm">
                <Box>  <Title order={2} fw={700}>Disbursal</Title></Box>
                <Box>
                    <Center>
                        <SegmentedControl
                            className="border border-gray-300"
                            w={400}
                            size="md"
                            color="blue"
                            value={activeTab}
                            onChange={setActiveTab}
                            data={[
                                { label: 'New', value: 'new' },
                                { label: 'Success', value: 'success' },
                                { label: 'Failure', value: 'failure' }
                            ]}
                        />
                    </Center>
                  
                </Box>
            </SimpleGrid>
            <Divider my="md" />
        </Box>
    )
}