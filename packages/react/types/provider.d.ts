export default class Provider extends React.Component<any, any, any> {
    /**
     * Provider child context types.
     *
     * @var {object}
     */
    static childContextTypes: {
        client: PropTypes.Validator<object>;
    };
    /**
     * Provider prop types.
     *
     * @var {object}
     */
    static propTypes: {
        client: PropTypes.Validator<object>;
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
import * as React from "react";
import * as PropTypes from "prop-types";
