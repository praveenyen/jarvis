'use client';

import { Box, Button, Center, Loader, LoadingOverlay, useMantineTheme, Text } from "@mantine/core";
import DisbursementHeader from '@/components/disbursement/DisbursementHeader';
import DisbursementFilter from '@/components/disbursement/DisbursementFilter';
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import DisbursementCardData from "./DisbursementCardData";
import { useDisbursalList, useDisbursalListCreditLine, useRejectReasonList } from "@/lib/queries/spiderman/queries";
import { Card, loanDetail, NewUtrSuccessPayload, ProcessToPayload, rejectedStatusPayload } from "./DisbursementCommonType";
import { modals } from "@mantine/modals";
import RejectModal from "@/components/disbursement/disbursementModals/RejectModal";
import { getDisbursementListCreditLine, processedToPay, putResonForReject, putUtrPayment } from "@/lib/queries/spiderman/service";
import HttpClientException from "@/lib/exceptions/HttpClientException";
import { useNotification } from "@/lib/context/notifications/useNotifications";
import { useDisclosure } from "@mantine/hooks";
import ProceedToPay from "./disbursementModals/ProceedToPay";
import CustomIcon from '@/components/icons/CustomIcons';
import MarkUTRSuccess from "./disbursementModals/MarkUTRSuccess";
import { TProductCodesShortened } from "@/lib/queries/groot/queryResponseTypes";
import { useLoanProductConfigs } from "@/lib/queries";
import { findLpcConfig, isCreditLine } from "./commonFunctionDisbursement";
import dayjs from 'dayjs';


type GroupData = {
    groupId: string;
    groupCreatedDate: string;
    partnerName: string | null;
    loanProductCode: string;
    loanProductId: string;
    workflowId: string | null;
    disbursalAmount: number;
    status: string;
    debitAccountDetails: {
        id: string;
        bufferAmount: number;
        bankName: string;
        accountNumber: string;
        accountName: string;
        ifscCode: string | null;
        mobileNumber: string | null;
        serviceProvider: string;
    };
    benefAccountDetails: {
        id: string;
        accNo: string;
        ifscCode: string;
        name: string;
        type: string;
        bankName: string;
    };
    loanDetails: {
        loanId: string;
        appFormId: string;
        loanAmount: number;
        disbursalAmount: number;
        fundingAllocation: number;
        status: string;
        partnerName: string;
        modeOfPayment: string | null;
        partnerLoanId: string;
        transactionDate: string | null;
        transactionDescription: string | null;
        utrNo: string | null;
        checkerId: number | null;
        offlineDisbursed: boolean;
        oldTransactionDate: string | null;
        oldTransactionDescription: string | null;
        oldUtrNo: string | null;
        loanCreatedDate: string | null;
        fee: number;
    }[];
    disbursalMakerId: number;
    withdrawalId: string | null;
};


export default function Disbursement() {
    const [activeTab, setActiveTab] = useState('new');
    const [cardSwitchStates, setCardSwitchStates] = useState<Record<string, boolean>>({});
    const [selectedCards, setSelectedCards] = useState<Record<string, boolean>>({});
    const [newUtr, setNewUtr] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [allGroups, setAllGroups] = useState<GroupData[]>([]);
    const [productType, setProductType] = useState<TProductCodesShortened[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null,null]);
    const [groupId, setGroupId] = useState<string>('');
    const theme = useMantineTheme();


    const [opened, { open, close }] = useDisclosure(false);

    const scrollToTopValue = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setProductType([]);
        setGroupId('');
     }, [activeTab]);


        const {
            data: productCodes,
            isSuccess: isgetLoanSuccess,
            status: getLoanStatus,
        } = useLoanProductConfigs();


    const scrollToTop = () => {
        const scrollBehaviour: ScrollIntoViewOptions = {
            behavior: 'smooth',
            block: 'start',
        };
        scrollToTopValue?.current?.scrollIntoView(scrollBehaviour as ScrollIntoViewOptions);
    };


    const { notify } = useNotification();

    // CORRECTED: cardList is now a state variable
    const [cardList, setCardList] = useState<Card[]>([]);

    const groupDateFromStr = dateRange.length === 2 && dateRange[0] ? dateRange[0] : undefined;
    const groupDateToStr = dateRange.length === 2 && dateRange[1] ? dateRange[1] : undefined;

    const groupDateFrom = groupDateFromStr
        ? dayjs(groupDateFromStr).toISOString()
        : undefined;

    const groupDateTo = groupDateToStr
        ? dayjs(groupDateToStr).toISOString()
        : undefined;

    const disbursalList = useDisbursalList(
        activeTab === 'new'
            ? '10'
            : activeTab === 'success'
                ? '1000'
                : '-90',
        page.toString(),
        productType,
        groupDateFrom,
        groupDateTo,
        groupId
    )

    const rejectReson = useRejectReasonList()

    // This effect handles accumulating data for infinite scroll and initial load
    useEffect(() => {

            if (disbursalList.data && disbursalList.data.disbursalGroups) {
                setTotalCount(disbursalList.data.count);
                setAllGroups(prev =>
                    page === 1
                        ? [...disbursalList.data.disbursalGroups]
                        : [
                            ...prev,
                            ...disbursalList.data.disbursalGroups.filter(
                                (group: GroupData) => !prev.some(g => g.groupId === group.groupId)
                            ),
                        ]
                );
            } else if (!disbursalList.isLoading && !disbursalList.isFetching && disbursalList.data?.disbursalGroups?.length === 0 && allGroups.length > 0) {
                setAllGroups([]);
                setTotalCount(0);
            }
       
    }, [disbursalList.data, page, productType, groupDateFrom, groupDateTo, groupId, disbursalList.isLoading, disbursalList.isFetching]);

    // NEW EFFECT: This updates cardList whenever allGroups changes
    // This is crucial for cardList to be reactive and correctly passed to DisbursementCardData
    useEffect(() => {
        setCardList(transformGroupsToCards(allGroups));
    }, [allGroups]); // Depend on allGroups to re-transform when it changes

    // This effect is specifically for when the activeTab changes
    useEffect(() => {
        setAllGroups([]); // Always clear groups when tab changes
        setPage(1); // Always reset page to 1 when tab changes
        setSelectedCards({}); // Clear selections when tab changes
        setCardSwitchStates({}); // Clear switch states when tab changes
        setNewUtr({}); // Clear UTR inputs as well
        disbursalList.refetch();
    }, [activeTab, productType, dateRange, groupId]);


    const fetchMoreData = () => {
        if (page * pageSize < totalCount) {
            setPage(prev => prev + 1);
        }
    };

    const { ref, inView } = useInView({
        threshold: 1,
    });

    useEffect(() => {
        if (inView && allGroups.length !== 0) {
            fetchMoreData();
        }
    }, [inView]);



    const rejectedStatus = async (rejectStatus: rejectedStatusPayload | ProcessToPayload) => {
        try {
            modals.closeAll();
            open();
            setPage(1);
            setAllGroups([]);
            await putResonForReject(rejectStatus);
            notify({ message: 'Loan status changed successfully!', type: 'success' });
            disbursalList.refetch();
            close();

        } catch (error: unknown) {
            if (error instanceof HttpClientException) {
                const errorMessage: any = error.getErrorResp();
                notify({ message: errorMessage['message'], type: 'error' });
            }
            close();
        }
    }

    const processToPay = async (processPayload: ProcessToPayload) => {
        try {
            modals.closeAll();
            open();
            setPage(1);
            setAllGroups([]);
            await processedToPay(processPayload);
            notify({ message: 'Transaction processed successfully!', type: 'success' });
            disbursalList.refetch();

            close();

        } catch (error: unknown) {
            if (error instanceof HttpClientException) {
                const errorMessage: any = error.getErrorResp();
                notify({ message: errorMessage['message'], type: 'error' });
            }
            close();
        }
    }

    const transformGroupsToCards = (groups: GroupData[]): Card[] => {
        return groups.map(group => ({
            id: group.groupId,
            loans: group.loanDetails,
            beneficiaryDetails: group.benefAccountDetails,
            partnerName: group.partnerName || '',
            loanProductCode: group.loanProductCode || '',
            groupCreatedDate: group.groupCreatedDate || '',
            disbursalAmount: group.disbursalAmount
        }));
    };


    // REMOVED: This direct assignment is replaced by the new useEffect for cardList
    // if (allGroups.length > 0) {
    //     cardList = transformGroupsToCards(allGroups);
    // }

    const totalPayable = cardList
        .filter(card => selectedCards[card.id])
        .reduce((sum, card) => sum + (card.disbursalAmount || 0), 0);

    const openRejectModal = (loanDetail: loanDetail, partnerName: string) => {
        modals.open({
            children: (
                <RejectModal loanDetail={loanDetail} partnerName={partnerName} rejectReson={rejectReson.data || []} rejectedStatus={rejectedStatus} />
            ),
            yOffset: '200px',
            size: 'xl',
        });
    }


    const updateUtr = async (updateUtrPayload: NewUtrSuccessPayload) => {
        try {
            modals.closeAll();
            open();
            setPage(1);
            setAllGroups([]);
            await putUtrPayment(updateUtrPayload, isCreditLine(productType[0]));
            notify({ message: 'UTR marked successfully!', type: 'success' });
            disbursalList.refetch();
            close();

        } catch (error: unknown) {
            if (error instanceof HttpClientException) {
                const errorMessage: any = error.getErrorResp();
                notify({ message: errorMessage['message'], type: 'error' });
            }
            disbursalList.refetch();

            close();
        }
    }

    const markNewUtrSuccess = (payload: NewUtrSuccessPayload) => {
        modals.open({
            children: (
                <MarkUTRSuccess utrSuccessPayload={payload} updateUtr={updateUtr} />
            ),
            yOffset: '200px',
            size: 'xl',
        });
    }


    const proceedToPayModal = (groupSelected: Record<string, boolean>, totalPayable: number) => {
        modals.open({
            children: (
                <ProceedToPay groupSelected={groupSelected} totalPayableAmount={totalPayable} proceedToPay={processToPay} />
            ),
            yOffset: '200px',
            size: 'xl',
        });
    }

    return (
        <Box p={15}>

            <Box pos="relative">
                <LoadingOverlay visible={opened} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <DisbursementHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                <Box ref={scrollToTopValue}></Box>

                <DisbursementFilter
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    productType={productType}
                    setProductType={setProductType}
                    groupId={groupId}
                    setGroupId={setGroupId}
                    productCodes={productCodes}
                />
                <DisbursementCardData
                    cardList={cardList}
                    activeTab={activeTab}
                    cardSwitchStates={cardSwitchStates}
                    setCardSwitchStates={setCardSwitchStates}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                    newUtr={newUtr}
                    setNewUtr={setNewUtr}
                    openRejectModal={openRejectModal}
                    rejectedStatus={rejectedStatus}
                    markNewUtrSuccess={markNewUtrSuccess}
                    isCreditLineProduct={isCreditLine(productType[0])}

                />

                {(disbursalList.isLoading || disbursalList.isFetching) && (
                    <Center
                        style={{
                            minHeight: "41rem",
                            width: "100%",
                            background: "rgba(255,255,255,0.7)",
                        }}
                    >
                        <Box className="flex flex-col items-center">
                            <Loader className="pt-2" color="blue" />
                            <br />
                            <span>Please wait we are fetching data</span>
                        </Box>
                    </Center>
                )}

                {(!disbursalList.isLoading && !disbursalList.isFetching && cardList.length === 0) && (
                    <Center
                        style={{
                            minHeight: "41rem",
                            width: "100%",
                            background: "rgba(255,255,255,0.7)",
                        }}
                    >
                        <Box className="flex flex-col items-center">
                            <h4>No data available.</h4>
                        </Box>
                    </Center>
                )}

                <div ref={ref} style={{ height: 1 }} />


                <Box
                    style={{
                        position: 'fixed',
                        bottom: 82,
                        right: 32,
                        zIndex: 1200,
                    }}
                >
                    <Button
                        onClick={() => scrollToTop()}
                        variant="filled"
                        color="blue"
                        radius="xl"
                        size="md"
                        style={{
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        }}
                    >
                        <CustomIcon
                            src={'MaterialIcon'}
                            name={'MdArrowUpward'}
                            color="white"
                            size="25px"
                            style={{ cursor: 'pointer' }}
                        />
                    </Button>
                </Box>



                {activeTab === "new" && (<Box
                    pos="sticky"
                    bottom={0}
                    bg="white"
                    style={{ bottom: '10px' }}
                    className="shadow-md border-t border-gray-200 px-6 py-3 mt-4 z-10"
                >
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                            Group Selected: {Object.keys(selectedCards).filter(key => selectedCards[key]).length}
                        </span>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xl font-semibold text-gray-900">{totalPayable.toLocaleString('en-IN')}</p>
                                <p className="text-sm text-gray-500">Payable Amount (INR)</p>
                            </div>
                            <button
                                className={`px-5 py-2 rounded-md font-medium shadow-sm transition flex items-center gap-2
    ${Object.keys(selectedCards).filter((key) => selectedCards[key]).length === 0
                                        ? 'bg-gray-400 cursor-not-allowed' // Styles when disabled (grey background, no-allowed cursor)
                                        : 'bg-blue-600 text-white hover:bg-blue-700' // Styles when enabled (blue background, white text, blue hover)
                                    }`}
                                disabled={Object.keys(selectedCards).filter((key) => selectedCards[key]).length === 0}
                                onClick={() => proceedToPayModal(selectedCards, totalPayable)}
                            >
                                <CustomIcon
                                    src={'MaterialIcon'}
                                    name={'MdCreditCard'}
                                    color="white"
                                    size="25px"
                                    style={{ cursor: 'pointer' }}
                                />
                                <span>Proceed to Pay</span>
                            </button>
                        </div>
                    </div>
                </Box>)}
            </Box>

        </Box>
    );
}