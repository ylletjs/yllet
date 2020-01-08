export default withClientData;
declare function withClientData(
  fn: any
): (
  Component: any
) => {
  new (): {
    /**
     * Default state.
     *
     * @var {object}
     */
    state: {
      data: {};
      error: null;
      loading: boolean;
    };
    /**
     * Fetch data on mount.
     */
    componentDidMount(): any;
    /**
     * Render component with client and api data.
     *
     * @return {object}
     */
    render(): any;
  };
  /**
   * withClient context types.
   *
   * @var {object}
   */
  contextTypes: {
    client: any;
  };
};
