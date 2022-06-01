import { Data, ChainInterface, ChainParams } from './Chain';
export interface StoreInterface {
    state: Data | null;
    chain: ChainInterface | null;
    readonly key: string | null;
    readonly ownerAddress: string | null;
    newState: (state?: Data) => void;
    newKey: (key: string) => void;
    newOwnerAddress: (address: string) => void;
    newChain: (params: ChainParams) => void;
    set: (key: string, value: any) => void;
    delete: (key: string) => void;
    save: () => Promise<any>;
}
export default class Store implements StoreInterface {
    state: Data | null;
    chain: ChainInterface | null;
    key: null;
    ownerAddress: null;
    constructor(params: ChainParams & {
        state: Data;
        key: string;
        ownerAddress: string;
    });
    newState(state: any): void;
    newKey(key: any): void;
    newOwnerAddress(address: any): void;
    newChain(params: any): void;
    set(key: any, value: any): void;
    delete(key: any): void;
    save(): Promise<any>;
}
