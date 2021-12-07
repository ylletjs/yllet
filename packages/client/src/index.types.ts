import Client from '.';

export type OptionsType = Record<string, any>;

export type ParamsType = Record<string, any>;

export type NextType = () => void;
export type MiddlewareType = (client: ClientType, next: NextType) => void;

export type ClientType = {};
