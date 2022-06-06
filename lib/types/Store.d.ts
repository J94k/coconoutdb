import { Data, ChainInterface, ChainParams, JsonValue } from './Chain';
export interface StoreInterface {
    data: Data | null;
    service: ChainInterface | null;
    readonly dataKey: string;
    readonly dataOwner: string;
    error?: Error;
    loading: boolean;
    newData: (data: Data | null) => void;
    newDataKey: (dataKey: string) => void;
    newDataOwner: (address: string) => void;
    newService: (params: ChainParams) => void;
    set: (key: string, value: JsonValue) => void;
    delete: (key: string) => void;
    readFromService: (dataKey?: string) => void;
    saveToService: () => void;
}
export default class Store implements StoreInterface {
    data: Data | null;
    service: ChainInterface | null;
    dataKey: string;
    dataOwner: string;
    error: any;
    loading: boolean;
    constructor(params: ChainParams & {
        dataKey: string;
    });
    newData(data: any): void;
    newDataKey(dataKey: any): void;
    newDataOwner(address: any): void;
    newService(params: any): void;
    set(key: any, value: any): void;
    delete(key: any): void;
    readFromService(): Promise<void>;
    saveToService(): Promise<void>;
}
