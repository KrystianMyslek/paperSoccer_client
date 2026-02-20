export enum fieldPlayer {
    empty = 0,
    A = 1,
    B = 2,
}

export type size = {
    x: number;
    y: number;
};

export type player = {
    id: string;
    name: string;
    type: fieldPlayer;
};

export type lobby = {
    id: string;
    name: string;
    owner: player;
    opponent?: player;
    size: size;
};
