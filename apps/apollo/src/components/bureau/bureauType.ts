import { TBureauOptionsItem } from "./BureauSelectDropdown";

export type Bureau = {
    pullType:string;
    vendor:TBureauOptionsItem["value"] | undefined;
}

export type BureauCreditReport = {
    bureau:Bureau,
    loanType:string,
    lpc: string,
    source: string,
    responseS3Url: string,
}