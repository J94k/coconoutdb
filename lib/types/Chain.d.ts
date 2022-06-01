export declare type Data<Key extends string = string, Value = any> = {
    [k in Key]: Value;
};
export declare type ChainParams = {
    address?: string;
    rpc?: string;
    provider?: any;
};
export declare type SaveParams = {
    key: string;
    data: Data;
    owner: string;
    onHash?: (hash: string) => void;
    onReceipt?: (receipt: any) => void;
};
export interface ChainInterface {
    readonly address: string;
    readonly rpc: string;
    readonly provider: string;
    readonly instance: any;
    readonly signerInstance: any;
    readonly pending: boolean;
    merge: (params: {
        oldData?: Data;
        newData?: Data;
    }) => Data;
    save: (params: SaveParams) => Promise<any>;
    fetch: (key: string) => Promise<{
        data: Data;
        owner: string;
    }>;
    clear: (key: string) => Promise<any>;
}
export default class Chain implements ChainInterface {
    address: any;
    rpc: any;
    provider: any;
    instance: any;
    signerInstance: any;
    pending: any;
    constructor({ address, rpc, provider }: ChainParams);
    merge({ oldData, newData }: {
        oldData?: {} | undefined;
        newData?: {} | undefined;
    }): {};
    fetch(key: any): Promise<{
        data: any;
        owner: any;
    }>;
    save({ key, data, owner, onHash, onReceipt }: {
        key: any;
        data: any;
        owner: any;
        onHash?: ((params: any) => void) | undefined;
        onReceipt?: ((params: any) => void) | undefined;
    }): Promise<unknown>;
    clear(key: any): Promise<unknown>;
}
