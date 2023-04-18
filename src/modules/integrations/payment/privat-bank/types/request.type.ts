import { CalcRequest } from "../interfaces/requests/calc.request";
import { CancelRequest } from "../interfaces/requests/cancel.request";
import { CheckRequest } from "../interfaces/requests/check.request";
import { PayRequest } from "../interfaces/requests/pay.request";
import { PresearchRequest } from "../interfaces/requests/presearch.request";
import { SearchRequest } from "../interfaces/requests/search.request";
import { UploadRequest } from "../interfaces/requests/upload.request";

export type PrivatXMLRequest = PayRequest | CancelRequest | CheckRequest | PresearchRequest | SearchRequest | UploadRequest;
export type PrivatJSONRequest = CalcRequest;