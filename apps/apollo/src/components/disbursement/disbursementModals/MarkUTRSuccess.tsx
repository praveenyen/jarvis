import { Button, Loader, Select } from "@mantine/core";
import { NewUtrSuccessPayload } from "../DisbursementCommonType";

type Props = {
    utrSuccessPayload: NewUtrSuccessPayload;
    updateUtr: (data: NewUtrSuccessPayload) => void
}
export default function MarkUTRSuccess({ utrSuccessPayload, updateUtr}:Props){

    const updateUtrPayment = (utrSuccessPayload: NewUtrSuccessPayload) => {
    const { oldUtr, ...payload } = utrSuccessPayload;
        updateUtr(payload)
    }

    return (
        <div className="grid pr-4 w-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-gray-900 uppercase">
                    Confirm the new UTR for a loan
                </span>
            </div>
            <div>
                <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400 p-0 m-0" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 items-center w-full">
                    <div>
                        <p className="text-sm font-medium text-gray-900">APP Id:</p>
                        <p className="text-sm text-gray-700">{utrSuccessPayload.appFormId}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Old UTR:</p>
                        <p className="text-sm text-gray-700">{utrSuccessPayload.oldUtr}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">New UTR:</p>
                        <p className="text-sm text-gray-700">{utrSuccessPayload.utr}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 w-full">
                    <Button
                        variant="filled"
                        color="blue"
                        className="w-32"
                        onClick={() => {
                            updateUtrPayment(utrSuccessPayload)
                        }}
                    >
                        Update UTR
                    </Button>
                </div>
            </div>
        </div>
    )
}