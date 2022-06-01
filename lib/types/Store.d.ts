import { Data, ChainInterface, ChainParams } from './Chain';
export interface StoreInterface {
    state: Data | null;
    chain: ChainInterface | null;
    newState: (state: Data | null) => void;
    newChain: (params: ChainParams) => void;
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    delete: (key: string) => void;
}
export default class Store implements StoreInterface {
    state: Data | null;
    chain: ChainInterface | null;
    constructor(params: ChainParams & {
        state: Data;
    });
    newState(state: any): void;
    newChain(params: any): void;
    get(key: any): any;
    set(key: any, value: any): void;
    delete(key: any): void;
}
