import React, {Component} from "react";
import {ThemeProvider} from '@material-ui/styles';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom'
import ReactNotification, {store} from 'react-notifications-component';
import {LocalizationProvider} from '@material-ui/pickers';
import {LoadingStartSystem} from "./components";
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {setAccount} from'./globalStore';

import storeRedux from './redux/store';
import theme from './theme';
import ruLocale from "date-fns/locale/ru";
import axiosInstance from "./agent/agent";
import apiUrls from "./constants/apiUrls";

import Routes from './routes';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';

import "./styles/fonts/index.scss";
import "./styles/styles/index.scss";
import "normalize.css/normalize.css";
import "react-tree-graph/dist/style.css";
import 'react-notifications-component/dist/theme.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            isLoading: true
        };

    }

    componentDidMount = () => {
        this.onCheckActiveSession();
    }

    onCheckActiveSession = () => {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            this.onUpdateAccount(jwt);

            return null
        }

        this.setState({ isLoading: false });
    }
    onUpdateAccount = (jwt) => {
        axiosInstance.defaults.headers['authentication'] = jwt;

        axiosInstance.get(apiUrls["user-me"]).then((response) => {
            const user = response.data.data.user;

            if (!user.admin) {
                this.setState({isLoading: false});

                store.addNotification({
                    title: "Ошибка",
                    message: "Вы не являетесь администратором системы",
                    type: 'danger',
                    insert: 'top',
                    container: 'bottom-left',
                    dismiss: {
                        duration: 3000,
                        onScreen: false,
                        pauseOnHover: true,
                        delay: 0
                    }
                });

                axiosInstance.defaults.headers['authentication'] = null;

                localStorage.removeItem('jwt');

                return null
            }

            this.setState({ account: user });

            this.setState({ isLoading: false })
        }).catch((error) => {
            axiosInstance.defaults.headers['authentication'] = null;

            localStorage.removeItem('jwt');

            this.setState({ isLoading: false })
        });

    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Provider store={storeRedux}>
                    <LocalizationProvider dateAdapter={DateFnsAdapter} locale={ruLocale}>
                        <ReactNotification/>

                        <BrowserRouter>
                            <Routes isLoading={this.state.isLoading} account={this.state.account}/>
                        </BrowserRouter>
                    </LocalizationProvider>
                </Provider>
            </ThemeProvider>
        )
    }
}

export default App
