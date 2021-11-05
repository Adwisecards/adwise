import React, {Component} from "react";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <>
                <main>
                    {this.props.children}
                </main>
            </>
        );
    }
}

export default Layout
