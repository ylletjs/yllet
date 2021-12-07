import Client from '.';

export type Options = Record<string, any>;

export type Params = Record<string, any>;

export type Next = () => void;
export type Middleware = (client: Client, next: Next) => void;

export type ClientType = {};
