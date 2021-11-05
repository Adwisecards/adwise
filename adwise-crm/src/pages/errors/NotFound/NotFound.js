import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";

import './styles.scss';
import localization from "../../../localization/localization";
import allTranslations from "../../../localization/allTranslations";

class NotFound extends Component {
    constructor(props) {
    super(props);

    this.state = {}
    }

    componentDidMount = () => {}

    render() {
        return (
            <div className="page-not-found">
                <div className="page-not-found__container">
                    <h1 className="page-not-found__title">{allTranslations(localization['errorPage.title'])}</h1>

                    <div className="page-not-found__content">
                        <div className="page-not-found__description">{allTranslations(localization['errorPage.message'])}</div>

                        <div className="page-not-found__container-image">
                            <img src="/img/page-not-found.png" className="page-not-found__image"/>
                        </div>

                        <div className="page-not-found__bottom">
                            <Link to="/" className="page-not-found__button-home">{allTranslations(localization['errorPage.button'])}</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound
