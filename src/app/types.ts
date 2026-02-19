export enum fieldPlayer {
    empty = 0,
    A = 1,
    B = 2,
}

export type size = {
    x: number;
    y: number;
};

export type lobby = {
    id?: string;
    name: string;
    owner: string;
    size: size;
};
