import { Data, ChainInterface } from './Chain';
declare type ChainParams = {
    address: string;
    rpc: string;
    library: any;
};
export interface StoreInterface {
    state: Data;
    chain: ChainInterface;
    newChain: (params: ChainParams) => void;
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    delete: (key: string) => void;
}
export default class Store implements StoreInterface {
    state: any;
    chain: any;
    constructor(params: ChainParams & {
        state: Data;
    });
    newChain(params: any): void;
    get(key: any): any;
    set(key: any, value: any): void;
    delete(key: any): void;
}
export {};
