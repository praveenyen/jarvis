import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Input, Switch, Tooltip } from "@mantine/core";
import { Card, NewUtrSuccessPayload, rejectedStatusPayload } from "./DisbursementCommonType";
import { formatDateToDDMMYYYY, truncateString } from "@/lib/utils/utils";




export type loanDetails = {
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
}


type CardSwitchStates = { [cardId: string]: boolean };
type SelectedCards = { [cardId: string]: boolean };
type NewUTR = { [cardId: string]: string };

type Props = {
    cardList: Card[];
    activeTab: string;
    cardSwitchStates: CardSwitchStates;
    setCardSwitchStates: React.Dispatch<React.SetStateAction<CardSwitchStates>>;
    selectedCards: SelectedCards;
    setSelectedCards: React.Dispatch<React.SetStateAction<SelectedCards>>;
    newUtr: NewUTR;
    setNewUtr: React.Dispatch<React.SetStateAction<NewUTR>>;
    openRejectModal: (loanDetails: loanDetails, partnerName: string) => void;
    rejectedStatus: (loanDetails: rejectedStatusPayload) => void;
    markNewUtrSuccess: (loanDetails: NewUtrSuccessPayload) => void;
    isCreditLineProduct: boolean;
};

export default function DisbursementCardData({ cardList, cardSwitchStates, setCardSwitchStates, selectedCards, setSelectedCards, activeTab, openRejectModal, rejectedStatus, newUtr, setNewUtr, markNewUtrSuccess, isCreditLineProduct }: Props) {




    const accpetLoad = (loanDetails: loanDetails) => {
        const payload = [
            {
                appFormId: loanDetails.appFormId,
                reason: null,
                checkerId: "Apollo",
                status: 80
            }
        ];
        rejectedStatus(payload);
    }

    const markSuccessNewUtr = (gId: string, loanDetails: loanDetails, newUtrValue: string) => {
        if (!newUtrValue) return;
        const payload =
        {
            appFormId: loanDetails.appFormId,
            groupId: gId,
            modeOfPayment: "NEFT",
            utr: newUtrValue,
            oldUtr: loanDetails.oldUtrNo
        }
        markNewUtrSuccess(payload);

    }

    return (
        <Box className="space-y-2">
            {cardList.map((card: Card, index: number) => {
                const isSelected = selectedCards[card.id] || false;
                const isAccepted = cardSwitchStates[card.id] ?? true;
                const newUtrValue = newUtr[card.id] || '';

                return (


                    <div
                        key={card.id + index}
                        className={`w-full p-4 bg-white border rounded-lg shadow-sm sm:p-8 transition-all duration-300 ${isSelected ? "border-blue-500" : "border-gray-200"
                            }`}
                    >
                        <div className="flex gap-4">


                            {/* Main Content */}
                            <div className="flex-1 flex gap-1">
                                {/* Left */}


                                <div className={'grid pr-4'} key={index}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {card.loans.length > 0 && activeTab == "new" && (
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    setSelectedCards((prev) => ({
                                                        ...prev,
                                                        [card.id]: !prev[card.id],
                                                    }))
                                                }
                                                className="w-4 h-4 accent-green-600"
                                            />
                                        )}

                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1"> {/* Added flex, items-center, flex-wrap, and gap */}
                                            {isCreditLineProduct ? (
                                                <span className="text-sm font-bold text-gray-800 uppercase">
                                                    loan ID: {card.loans[0]?.loanId}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-bold text-gray-800 uppercase">
                                                    Group ID: {card.id}
                                                </span>
                                            )}

                                            <span className="text-sm font-bold text-green-600 uppercase">
                                                Partner Name: {card.partnerName} | {card.loanProductCode}
                                            </span>
                                            <span className="text-sm text-gray-700 uppercase">
                                                <b> Account no:</b> {card?.beneficiaryDetails?.accNo || ''}
                                            </span>
                                            <span className="text-sm text-gray-700 uppercase">
                                                <b> Account Holder Name:</b> {card?.beneficiaryDetails?.name || ''}
                                            </span>
                                            <span className="text-sm text-gray-700 uppercase">
                                                <b>Bank Name:</b> {card?.beneficiaryDetails?.bankName}
                                            </span>
                                            <span className="text-sm text-gray-700 uppercase">
                                                <b>Account type:</b> {card?.beneficiaryDetails?.type}
                                            </span>
                                            <span className="text-sm text-gray-700 uppercase">
                                                <b>IFSC Code:</b> {card?.beneficiaryDetails?.ifscCode}
                                            </span>
                                        </div>
                                        {/* )} */}
                                    </div>
                                    {card.loans && card.loans.length > 0 && (
                                        card.loans.map((loan, loanIdx) => (
                                            <div key={loanIdx}>
                                                <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400 p-0 m-0" />
                                                <div
                                                    className={
                                                        activeTab === "new"
                                                            ? "grid grid-cols-8 mb-2 items-center"
                                                            : activeTab === "success"
                                                                ? "grid grid-cols-10 mb-2 items-center"
                                                                : activeTab === "failure"
                                                                    ? "grid grid-cols-10 mb-2 items-center"
                                                                    : "grid grid-cols-7 mb-2 items-center"
                                                    }
                                                >
                                                    <div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">Group Date:</p>
                                                        <p className="text-sm text-gray-700">{formatDateToDDMMYYYY(card.groupCreatedDate, true)}</p>
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">Partner Loan ID:</p>
                                                        <p className="text-sm text-gray-700 break-words">{loan?.partnerLoanId || ''}</p>
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">Loan ID:</p>
                                                        <p className="text-sm text-gray-700 break-words">{loan?.loanId || ''}</p>
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">App ID:</p>
                                                        <p className="text-sm text-gray-700 break-words">{loan?.appFormId || ''}</p>
                                                    </div>

                                                    {(activeTab == "success") && (<div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">Loan (INR):</p>
                                                        <p className="text-sm text-gray-700">{loan?.loanAmount || ''}</p>
                                                    </div>)}
                                                    <div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">Processing Fees:</p>
                                                        <p className="text-sm text-gray-700">{loan?.fee == 0 ? 0 : loan?.fee}</p>
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-sm font-medium text-gray-900">Allocation %:</p>
                                                        <p className="text-sm text-gray-700">
                                                            {loan?.fundingAllocation === 1 ? 100 : loan?.fundingAllocation || ''}
                                                        </p>
                                                    </div>
                                                    {(activeTab == "new" || activeTab == "failure") && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">Payable:</p>
                                                            <p className="text-sm text-gray-700">{card?.disbursalAmount}</p>
                                                        </div>)}
                                                    {activeTab == "failure" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">Failure date-time:</p>
                                                            <p className="text-sm text-gray-700">{formatDateToDDMMYYYY(loan?.transactionDate, true)}</p>
                                                        </div>)}
                                                    {activeTab == "failure" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">Failure reason:</p>
                                                            <p className="text-sm text-gray-700">{loan?.transactionDescription}</p>
                                                        </div>)}
                                                    {activeTab == "failure" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">Old UTR:</p>
                                                            <p className="text-sm text-gray-700">{loan?.oldUtrNo || ""}</p>
                                                        </div>)}
                                                    {activeTab == "failure" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">New UTR:</p>
                                                            <Box className="flex items-center gap-2">
                                                                <Input
                                                                    placeholder="Enter new UTR"
                                                                    value={newUtrValue}
                                                                    // onChange={(event) => setValue(event.currentTarget.value)}
                                                                    onChange={e => {
                                                                        const value = e.currentTarget ? e.currentTarget.value : '';
                                                                        setNewUtr((prev) => ({
                                                                            ...prev,
                                                                            [card.id]: value,
                                                                        }));
                                                                    }}
                                                                    rightSection={newUtrValue !== '' ? <Input.ClearButton onClick={() => setNewUtr((prev) => ({ ...prev, [card.id]: '' }))} /> : undefined}
                                                                    rightSectionPointerEvents="auto"
                                                                    size="sm"
                                                                    className="bg-white text-blue-600 border-blue-400"
                                                                    style={{ minWidth: 150 }}
                                                                />
                                                                <Text
                                                                    size="xs"
                                                                    className={`cursor-pointer ml-2 font-semibold ${newUtrValue.length > 0 ? "text-blue-600" : "text-gray-400"}`}
                                                                    style={{ whiteSpace: "nowrap" }}
                                                                    onClick={() => markSuccessNewUtr(card.id, loan, newUtrValue)}
                                                                >
                                                                    Mark Success
                                                                </Text>
                                                            </Box>
                                                        </div>)}
                                                    {activeTab == "success" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">PAID (INR):</p>
                                                            <p className="text-sm text-gray-700">{card?.disbursalAmount}</p>
                                                        </div>
                                                    )}
                                                    {activeTab == "success" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">Disbursal Date:</p>
                                                            <p className="text-sm text-gray-700">{formatDateToDDMMYYYY(loan?.transactionDate, true)}</p>
                                                        </div>
                                                    )}
                                                    {activeTab == "success" && (
                                                        <div className="p-2">
                                                            <p className="text-sm font-medium text-gray-900">UTR:</p>
                                                            <Tooltip label={loan?.utrNo}>
                                                            {loan?.utrNo !== undefined && (
                                                                <p className="text-sm text-gray-700">{(loan?.utrNo ?? '').length > 12 ? truncateString(12, loan?.utrNo ?? '') : (loan?.utrNo ?? '')}</p>
                                                            )}
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                    {activeTab == "new" && (<div className="flex items-center justify-center">
                                                        {loan.status == '-80' ? (
                                                            <Switch
                                                                size='xl'
                                                                w={100}
                                                                checked={false}
                                                                onLabel="Rejected"
                                                                offLabel="Rejected"
                                                                onChange={() =>
                                                                    accpetLoad(loan)
                                                                }
                                                                classNames={{
                                                                    track: "bg-red-100 border border-red-500",
                                                                    thumb: "bg-red-600",
                                                                }}
                                                            />
                                                        ) : (
                                                            <Switch
                                                                size='xl'
                                                                w={100}
                                                                checked={isAccepted}
                                                                onChange={() =>
                                                                    openRejectModal(loan, card.partnerName)
                                                                }
                                                                onLabel="Accepted"
                                                                offLabel="Rejected"
                                                                classNames={{
                                                                    track: isAccepted ? "" : "bg-red-100 border border-red-500",
                                                                    thumb: isAccepted ? "bg-blue-600" : "bg-red-600",
                                                                }}
                                                            />
                                                        )}
                                                    </div>)}
                                                </div>
                                            </div>

                                        ))
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Box>
    )

}