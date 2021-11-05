import React, {Component} from "react";
import {ThemeProvider} from '@material-ui/styles';
import {connect, Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom'
import ReactNotification from 'react-notifications-component';
import {LocalizationProvider} from '@material-ui/pickers';

import storeRedux from './redux/store';
import theme from './theme';
import ruLocale from "date-fns/locale/ru";
import i18n from "i18n-js";

import Routes from './routes/Routes';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import SignUpStep1Form from "./forms/sign-up/step-1/index"

import "./App.scss";
import "./styles/fonts/index.scss";
import "normalize.css/normalize.css";
import 'react-notifications-component/dist/theme.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-image-crop/dist/ReactCrop.css';
import "react-pdf/dist/umd/Page/AnnotationLayer.css";
import moment from "moment";
import ruLocaleMoment from "moment/locale/ru";
import enLocaleMoment from "moment/locale/en-au";

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.setLocale();
        this.setLocaleMoment();
    }

    setLocale = () => {
        i18n.locale = localStorage.getItem('language') || 'ru';
    }
    setLocaleMoment = () => {
        if (i18n.locale === "ru") {
            moment.locale('ru', [ruLocaleMoment]);
        }
        if (i18n.locale === "en") {
            moment.locale('en', [enLocaleMoment]);
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Provider store={storeRedux}>
                    <LocalizationProvider dateAdapter={DateFnsAdapter} locale={ruLocale}>
                        <ReactNotification/>

                        <BrowserRouter>
                            <Routes/>
                        </BrowserRouter>
                    </LocalizationProvider>
                </Provider>
            </ThemeProvider>
        )
    }
}

export default App;
