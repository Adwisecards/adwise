import React, {Component} from "react";
import {
    Header as HeaderComponent
} from "./components";
import "./style.css";

class Layout extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="landing">
                <HeaderComponent/>

                <main className="main">
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default Layout
