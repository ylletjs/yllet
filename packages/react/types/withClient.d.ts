export default withClient;
declare function withClient(Component: any): {
    new (): {
        /**
         * Render component with client.
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
