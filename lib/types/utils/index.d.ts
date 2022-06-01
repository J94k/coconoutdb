export declare enum Log {
    error = 0,
    warning = 1
}
export declare function log({ value, title, type }: {
    value: any;
    title: string;
    type?: Log;
}): void;
