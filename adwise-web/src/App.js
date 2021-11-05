import React, { useEffect } from 'react';
import './App.css';
import './index.css';
import ReactNotification, {store} from 'react-notifications-component';
import CompanyCard from './components/CompanyCard/CompanyCard';
import ExtangeCard from './components/ExchangeCard/ExtangeCard';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from './store';
import Routes from "./routes";
import Loader from './components/ui/Loader';
import Error from './components/ui/Error';

import {
  NotFound as NotFoundView,
  QuestionAnswer as QuestionAnswerView
} from './views';
import Lending from './views/Lending';
import PrivacyPolicy from './views/PrivacyPolicy';
import BuisnessCard from './components/BusinessCard';
import ScorePage from './components/ScorePage/Index';
import SpecialPage from './components/SpecialPage';
import UserAgrement from './views/UserAgrement';
import CookiesPolicy from './views/CookiesPolicy';
import DeliveryTerms from './views/DeliveryTerms';
import PaymentSuccessful from './views/PaymentSuccessful';
import PaymentFail from './views/PaymentFail';
import AdvertisingAgreement from './views/AdvertisingAgreement';
import Tips from "./views/Tips/TipsContainer";
import Refs from "./views/Refs/RefsContainer";
import Purchase from "./views/Purchase/PurchaseContainer";
import Contact from "./views/Contact/ContactContainer";

import 'react-notifications-component/dist/theme.css';

function App({ getMe, loaderShown, error, hideError }) {
  useEffect(() => {
    getMe();
    return;
  }, []);
  return (
    <BrowserRouter>
      <div className='wrapper'>

        <ReactNotification/>

        {/*{loaderShown ? <Loader /> : null}*/}
        {error ? <Error onClose={hideError} message={error} /> : null}

        <Routes/>

        <Switch>
          {/*<Route path='/organization/:id/:ref?' component={CompanyCard} />*/}
          {/*<Route path='/special/:id/:ref?' component={SpecialPage} />*/}
          {/*<Route path='/ref/:ref?' component={Refs} />*/}
          {/*<Route path='/sign-up' component={ExtangeCard} />*/}
          {/*<Route path='/privacy-policy' component={PrivacyPolicy} />*/}
          {/*<Route path='/cookies-policy' component={CookiesPolicy} />*/}
          {/*<Route path='/delivery-terms' component={DeliveryTerms} />*/}
          {/*<Route path='/successful-payment' component={PaymentSuccessful} />*/}
          {/*<Route path='/fail-payment' component={PaymentFail} />*/}
          {/*<Route path='/user-agreement' component={UserAgrement} />*/}
          {/*<Route*/}
          {/*  path='/advertising-agreement'*/}
          {/*  component={AdvertisingAgreement}*/}
          {/*/>*/}
          {/*<Route path='/card/:id' component={BuisnessCard} />*/}
          {/*<Route path='/contact-new/:id' component={Contact} />*/}
          {/*<Route path='/tips/:id' component={Tips} />*/}
          {/*<Route path='/purchase/:id' component={Purchase} />*/}
          {/*<Route path='/order/:id/:ref?' component={ScorePage} />*/}
          {/*<Route path='/not-found' component={NotFoundView} />*/}
          {/*<Route path='/question-answer' component={QuestionAnswerView} />*/}
          {/*<Route exact path='/' component={Lending} />*/}
          {/*<Route component={NotFoundView} />*/}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMe: () => dispatch(actions.user.getMe()),
    hideError: () => dispatch(actions.ui.hideError()),
  };
};

const mapStateToProps = (state) => {
  return {
    loaderShown: state.ui.loaderShown,
    error: state.ui.error,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
