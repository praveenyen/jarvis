import { TProductCodesShortened } from "@/lib/queries/groot/queryResponseTypes";

export const findLpcConfig = (lpcCode: string, lpcConfig: TProductCodesShortened[]|undefined) => {
        if (!lpcConfig || lpcConfig.length === 0) return undefined;

        const lpc = lpcConfig.find((item) => item.code === lpcCode);
        if (lpc) {
            return lpc;
        }
        return undefined;
    }



export const getLpcFromList = (lpcConfig: TProductCodesShortened[]) => {

    const lpcList: string[] = [];
    lpcConfig.forEach((item) => {
        lpcList.push(item.code);
    })
    return lpcList;
}

export const isCreditLine = (lpcConfig: TProductCodesShortened) => {
    if (lpcConfig == undefined || lpcConfig === null) return false;
    if (lpcConfig.isCreditLine && (lpcConfig.disbursalWorkflowName == 'hercules-credit-line-disbursal-workflow' || lpcConfig.disbursalWorkflowName == 'credit-line-workflow')) {
        return true;
    }
    return false;

}