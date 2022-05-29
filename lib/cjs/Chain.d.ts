export declare type Data = {
    [k: string]: any;
};
export interface ChainInterface {
    readonly address: string;
    readonly library: any;
    readonly instance: any;
    readonly signerInstance: any;
    readonly pending: boolean;
    merge: (params: {
        oldData: Data;
        newData: Data;
    }) => Data;
    save: (params: {
        key: string;
        data: Data;
        owner: string;
        onHash?: (hash: string) => void;
        onReceipt?: (receipt: any) => void;
    }) => Promise<any>;
    fetch: (key: string) => Promise<{
        data: Data;
        owner: string;
    }>;
    clear: (key: string) => Promise<any>;
}
export default class Chain implements ChainInterface {
    address: any;
    library: any;
    instance: any;
    signerInstance: any;
    pending: any;
    constructor({ address, rpc, library }: {
        address: string;
        rpc: string;
        library: any;
    });
    merge({ oldData, newData }: {
        oldData: Data;
        newData: Data;
    }): Data;
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
