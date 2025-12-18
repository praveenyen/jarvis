import { Button, Loader, Select } from "@mantine/core";
type Props = {
    groupSelected: Record<string, boolean>;
    totalPayableAmount: number;
    proceedToPay: (data: {
        groupId: string,
        status: string
    }[]) => void
}
export default function ProceedToPay({ groupSelected, totalPayableAmount, proceedToPay }:Props){

    const processedToPay = (groupSelected: Record<string, boolean>) => {
        const payload = Object.keys(groupSelected)
            .filter(key => groupSelected[key])
            .map(key => ({
                groupId: key,
                status: "20"
            }));
            proceedToPay(payload);
    }

    return (
        <div className="grid pr-4 w-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-gray-900 uppercase">
                    Confirm the amount to initiate disbursal
                </span>
            </div>
            <div>
                <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400 p-0 m-0" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2 items-center w-full">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Group Selected:</p>
                        <p className="text-sm text-gray-700">{Object.keys(groupSelected).filter(key => groupSelected[key]).length}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Payable Amount (INR):</p>
                        <p className="text-sm text-gray-700">{totalPayableAmount}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2 w-full">
                    <div className="flex justify-center w-full">
                        <Button
                            variant="filled"
                            color="blue"
                            disabled={Object.keys(groupSelected).filter(key => groupSelected[key]).length === 0}
                            className="w-32"
                            onClick={() => {
                                processedToPay(groupSelected);
                            }}
                        >
                            Pay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}