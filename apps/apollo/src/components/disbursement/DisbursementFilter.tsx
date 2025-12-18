import { Box, Divider, SimpleGrid, Input, MultiSelect, CloseButton } from "@mantine/core";
import CustomIcon from "../icons/CustomIcons";
import { useEffect, useImperativeHandle, useState } from "react";
import dayjs from 'dayjs';
import { DateFormatter, DatePickerInput } from "@mantine/dates";
import { formatDateToDDMMYYYY } from "@/lib/utils/utils";
import { useLoanProductConfigs } from '@/lib/queries/groot/queries';
import { getLoanProductConfigs } from "@/lib/queries/groot/services";
import { TProductCodesShortened } from "@/lib/queries/groot/queryResponseTypes";
import { findLpcConfig, getLpcFromList, isCreditLine } from "./commonFunctionDisbursement";
import { debug } from "console";

type Props = {
    dateRange: [Date | null, Date | null];
    setDateRange: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>;
    productType: TProductCodesShortened[];
    setProductType: React.Dispatch<React.SetStateAction<TProductCodesShortened[]>>;
    groupId: string;
    setGroupId: React.Dispatch<React.SetStateAction<string>>;
    productCodes?: TProductCodesShortened[];

};

export default function DisbursementFilter({ dateRange, setDateRange, productType, setProductType, groupId, setGroupId, productCodes  }: Props) {


    const [groupIdLocal, setGroupIdLocal] = useState<string>('');

    useEffect(() => {
        setGroupIdLocal("");
    }, [groupId]);


    const filterLpcList = (lpcConfig: TProductCodesShortened[]|undefined) => {

        if (productType.length > 0){

            const lpc = findLpcConfig(productType[0].code, lpcConfig);
            if (lpc && lpc?.isCreditLine){
                const creditLineLpcList = lpcConfig?.filter((item) => isCreditLine(item));
                if (!creditLineLpcList || creditLineLpcList.length === 0) return [];
                return getLpcFromList(creditLineLpcList);
            }

            if (lpc && lpc?.isCreditLine == false){
                const nonCreditLineLpcList = lpcConfig?.filter((item) => !item.isCreditLine);
                if (!nonCreditLineLpcList || nonCreditLineLpcList.length === 0) return [];
                return getLpcFromList(nonCreditLineLpcList);
            }
        }

        if (!lpcConfig || lpcConfig.length === 0) return [];
        return getLpcFromList(lpcConfig)

    }


    


    const setLpcConfigList = (lpcValues:string[]) =>{
        const lpcConfig: TProductCodesShortened[] = [];
        lpcValues.forEach((item:string) => {
            const lpc = findLpcConfig(item, productCodes);
            if (lpc){
                lpcConfig.push(lpc)
            }
        })

        setProductType(lpcConfig);
    }


    const clearFilter = ()=>{
        setDateRange([null, null]);
        setProductType([]);
        setGroupId('');
        setGroupIdLocal('');
    }

    const searchIcon: any = <CustomIcon
        src="MaterialIcon"
        name="MdPersonSearch"
        size="20px"
    />

    return (
        <Box>
            <SimpleGrid cols={3} spacing="sm">
                <Box>
                    <Input.Wrapper label={isCreditLine(productType[0]) ? "Search by Loan ID" : "Search by Group ID"}>
                        <Input
                            className="border border-gray-100 rounded-md"
                            value={groupId}
                            onChange={(event) => {setGroupIdLocal(event.currentTarget.value), setGroupId(event.currentTarget.value)}}
                            rightSectionPointerEvents="all"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    setGroupId((event.target as HTMLInputElement).value);
                                }
                            }}
                            rightSection={
                                <CloseButton
                                    aria-label="Clear input"
                                    onClick={() => {setGroupIdLocal(''); setGroupId('')}}
                                    style={{ display: groupId ? undefined : 'none' }}
                                />
                            }
                            placeholder={ isCreditLine(productType[0]) ? "Search by Loan ID" : "Search by Group ID"}
                            leftSection={searchIcon}
                        />
                    </Input.Wrapper>
                </Box>
                <Box>
                    <Input.Wrapper label="PRODUCT TYPES" className="font-light">
                        <MultiSelect
                            value={getLpcFromList(productType)}
                            onChange={setLpcConfigList}
                            className="border border-gray-100 rounded-md"
                            placeholder="Select Partner Type"
                            data={filterLpcList(productCodes)}
                            searchable
                            clearable
                        />
                    </Input.Wrapper>
                </Box>
                <Box>
                    <Input.Wrapper label="GROUP DATES">
                        <DatePickerInput
                            placeholder="Pick date"
                            type="range"
                            valueFormat="DD/MM/YYYY"
                            allowSingleDateInRange={true}
                            value={dateRange}
                            onChange={(val: [string | null, string | null]) => {
                                const dateValues: [Date | null, Date | null] = [
                                    val[0] ? new Date(val[0]) : null,
                                    val[1] ? new Date(val[1]) : null
                                ];
                                setDateRange(dateValues);
                            }}
                            maxDate={dayjs().toDate()}
                            clearable
                        />
                    </Input.Wrapper>
                </Box>
                {(dateRange.length > 1 || productType.length > 0 || groupId.length > 0) && (
                    <Box w={200}>
                        <span className="flex items-center text-red-500 font-bold cursor-pointer" style={{ width: 'fit-content' }} onClick={() => clearFilter()}>
                            Clear Filter
                            <CustomIcon
                                className="ml-1"
                                src="MaterialIcon"
                                name="MdOutlineBlock"
                                size="15px"
                            />
                        </span>
                    </Box>
                )}
            </SimpleGrid>
            <Divider my="md" />

        </Box>
    )

}