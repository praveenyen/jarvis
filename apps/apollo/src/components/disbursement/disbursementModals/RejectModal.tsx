import { Button, Loader, Select } from "@mantine/core";
import { useState } from "react";
import { loanDetail, rejectedStatusPayload } from "../DisbursementCommonType";

type Props = {
    loanDetail: loanDetail;
    partnerName: string;
    rejectReson:{id:string, loanStatus:string, reason:string}[]
    rejectedStatus: (data: rejectedStatusPayload) => void
}
export default function RejectModal({ loanDetail, partnerName, rejectReson, rejectedStatus }:Props){
    const [reason, setReason] = useState<string | null>(null);


    const isRejected = (loanDetails: loanDetail, reason:string|null)=>{
        if (!reason) return;
        const payload = [
            {
                appFormId: loanDetails.appFormId,
                reason: reason,
                checkerId: "Apollo",
                status: "-80"
            }
        ];

        rejectedStatus(payload);
        
    }

    return (
        <div className="grid pr-4 w-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-green-600 uppercase">
                    Partner Name: {partnerName}
                </span>
            </div>
            <div>
                <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400 p-0 m-0" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 items-center w-full">
                    <div>
                        <p className="text-sm font-medium text-gray-900">App ID:</p>
                        <p className="text-sm text-gray-700">{loanDetail.appFormId}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Loan (INR):</p>
                        <p className="text-sm text-gray-700">{loanDetail.loanAmount}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Allocation %:</p>
                        <p className="text-sm text-gray-700">{loanDetail.fundingAllocation === 1 ? 100 : loanDetail?.fundingAllocation || ''}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Payable:</p>
                        <p className="text-sm text-gray-700">{loanDetail.disbursalAmount}</p>
                    </div>
                </div>
                <div className="flex items-end gap-4 mt-2 w-full">
                    <div className="flex-1">
                        <Select
                            value={reason}
                            label="Reason"
                            placeholder="Select reason"
                            data={rejectReson.map((item: any) => ({
                                value: item.reason,
                                label: item.reason
                            }))}
                            clearable
                            onChange={setReason}
                        />
                    </div>
                    <Button
                        variant="filled"
                        color="red"
                        disabled={!reason}
                        className="w-32"
                        onClick={() => {
                            isRejected(loanDetail, reason)
                        }}
                    >
                        Reject
                    </Button>
                </div>
            </div>
        </div>
    )
}