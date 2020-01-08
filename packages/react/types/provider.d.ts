export default class Provider {
    /**
     * Provider child context types.
     *
     * @var {object}
     */
    static childContextTypes: {
        client: any;
    };
    /**
     * Provider prop types.
     *
     * @var {object}
     */
    static propTypes: {
        client: any;
    };
    /**
     * Provider constructor.
     *
     * @param {object} props
     * @param {object} context
     */
    constructor(props: any, context: any);
    /**
     * Get child context.
     *
     * @return {object}
     */
    getChildContext(): any;
    /**
     * Render Provider.
     *
     * @return {object}
     */
    render(): any;
}
