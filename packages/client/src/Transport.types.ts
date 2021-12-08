export interface Transport {
  delete(
    url: string,
    data: Record<string, any> | undefined,
    config: Record<string, any>
  ): any;
  get(
    url: string,
    data: Record<string, any> | undefined,
    config: Record<string, any>
  ): any;
  post(
    url: string,
    data: Record<string, any> | undefined,
    config: Record<string, any>
  ): any;
  put(
    url: string,
    data: Record<string, any> | undefined,
    config: Record<string, any>
  ): any;
}
