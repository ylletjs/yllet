export interface Transport {
  delete(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {}
  );
  get(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {}
  );
  post(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {}
  );
  put(
    url: string,
    data: Record<string, any> | undefined = undefined,
    config: Record<string, any> = {}
  );
}
