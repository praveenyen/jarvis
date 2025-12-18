// ViewActivityModal.tsx
import CustomIcon from "@/components/icons/CustomIcons";
import { getDocActivity } from "@/lib/queries/drStrange/service";
import { TAppformData } from "@/lib/queries/shield/queryResponseTypes";
import { AppUser, UsersResponse } from "@/lib/queries/heimdall/queryResponseTypes";
import { appFormRawData } from "@/store/atoms";
import { allUsers } from "@/store/atoms/user";

import {
    Box,
    Button,
    Divider,
    Group,
    LoadingOverlay,
    MultiSelect,
    Pagination,
    Select,
    Table,
    Text,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DocActivity } from "../DocumentScreenType";


const parseApiTimestamp = (raw: string) => {
    const [d, m, y] = raw.split("T")[0].split("-");
    return new Date(`${y}-${m}-${d}T${raw.split("T")[1].replace("+0000", "Z")}`);
};

export default function ViewActivityModal() {
    const [statuses, setStatuses] = useState<string[]>([]);
    const [sortType, toggleSort] = useToggle(["dsc", "asc"]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState("10");

    const filters: DocActivity = useMemo(
        () => ({
            documentActivity: statuses.join(","),
            page: page.toString(),
            size: perPage,
            sortOrder: sortType,
        }),
        [statuses, page, perPage, sortType],
    );

    const appformData = useAtomValue<TAppformData | null>(appFormRawData);
    const usersArr = useAtomValue<UsersResponse | null>(allUsers);

    const usersMap = useMemo(
        () =>
            usersArr
                ? Object.fromEntries(
                    (usersArr.users ?? []).map((u: AppUser) => [u.id, { name: u.name, email: u.email }])
                )
                : {},
        [usersArr],
    );

    const { data, isFetching } = useQuery({ // isFetching is correctly destructured here
        queryKey: ["docActivity", appformData?.id, filters],
        enabled: !!appformData?.id,
        queryFn: () => getDocActivity(filters, appformData!.id)
    });

    /* table rows */
    const rows =
        data?.docActivityDtoList?.map((r: any, i: any) => {
            const user = usersMap[r.userId] ?? {};
            return (
                <Table.Tr key={r.id}>
                    <Table.Td>{i + 1 + page * Number(perPage)}</Table.Td>
                    <Table.Td>
                        {parseApiTimestamp(r.timestamp).toLocaleString("en-IN", { hour12: false })}
                    </Table.Td>
                    <Table.Td>{r.docType ?? "—"}</Table.Td>
                    <Table.Td>{r.fileName ?? "—"}</Table.Td>
                    <Table.Td>  <Text tt="capitalize" c="blue">{r.docActivity}</Text></Table.Td>
                    <Table.Td>{user.name ?? r.userId}</Table.Td>
                    <Table.Td>{user.email ?? r.userId}</Table.Td>
                </Table.Tr>
            );
        }) ?? [];

    return (
        <Box>
            <LoadingOverlay
                visible={isFetching}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'pink', type: 'bars' }}
            />
            <Text size="xl" fw={500}>Documents Activity log</Text>
            <Text size="md" fw={500}>Document Status</Text>

            <div className="flex items-center space-x-4 mb-4">
                <MultiSelect
                    miw={200}
                    maw={500}
                    searchable
                    placeholder="Select status"
                    value={statuses}
                    onChange={setStatuses}
                    data={["UPLOADED", "DELETED", "TAGGED", "UNTAGGED"]}
                />

                <Button onClick={() => toggleSort()}>
                    Sort&nbsp;
                    {sortType === "dsc" ? (
                        <CustomIcon src="MaterialIcon" name="MdArrowDownward" size="16px" />
                    ) : (
                            <CustomIcon src="MaterialIcon" name="MdArrowUpward" size="16px" />
                    )}
                </Button>
            </div>

            <Box className="block max-h-72 overflow-y-auto">
                <Table
                    highlightOnHover
                    withTableBorder
                    stickyHeader
                    className="w-full"
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="min-w-[100px]">S. No</Table.Th>
                            <Table.Th className="min-w-[150px]">Date/Time</Table.Th>
                            <Table.Th className="min-w-[200px]">Document Type</Table.Th>
                            <Table.Th className="min-w-[150px]">File Name</Table.Th>
                            <Table.Th className="min-w-[150px]">Document Activity</Table.Th>
                            <Table.Th className="min-w-[200px]">User Name</Table.Th>
                            <Table.Th className="min-w-[250px]">Email ID</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {rows.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={7} h={200} className="text-center">
                                    No data available
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            rows
                        )}
                    </Table.Tbody>
                </Table>
            </Box>

            <Divider my="md" />

            <div className="flex items-center space-x-4 mb-4">
                <Text>Total {data?.totalCount ?? 0}</Text>

                <Select
                    w={100}
                    placeholder="per page"
                    value={perPage}
                    onChange={v => { setPerPage(v!); setPage(0); }}
                    data={["5", "10", "25", "50", "100"]}
                />

                <Pagination.Root
                    total={Math.max(1, Math.ceil((data?.totalCount ?? 0) / Number(perPage)))}
                    value={page + 1}
                    onChange={p => setPage(p - 1)}
                    disabled={isFetching}
                >
                    <Group gap={5} justify="center">
                        <Pagination.First />
                        <Pagination.Previous />
                        <Pagination.Items />
                        <Pagination.Next />
                        <Pagination.Last />
                    </Group>
                </Pagination.Root>
            </div>
        </Box>
    );
}