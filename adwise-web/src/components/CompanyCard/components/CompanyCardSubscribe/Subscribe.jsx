import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { actions } from '../../../../store';
import { openCompanyPage } from '../../../../helper/eventOpenApp';
import checkIsApp from '../../../../helper/checkIsApp';
import { Profile, SubscribeBox } from './components/';
import QrcodeViews from './components/QrcodeViews/QrcodeViews';
import {loggingLogEventWithProperties} from "../../../../helper/Logging";

import moment from "moment";

function Subscribe(props) {
  const {
    name,
    briefDescription,
    qrcode,
    logo,
    background,
    location,
    organization,
    user,
    orgRef,
    subscribeToOrganization,
    id,
    error,
    primary = '#0084ff',
    button = true,
    qrcodeViews = true,
  } = props;
  const [subscribed, setSubscribed] = useState(false);
  const [isApp, setIsApp] = useState(false);
  const history = useHistory();

  const onSubscribe = async () => {
    const body = {
      contactId: user.contacts[0]._id,
    };

    if (orgRef) {
      body.invitationId = orgRef.ref;
    }
    if (props.id) {
      const [data, error] = subscribeToOrganization(id, body);
    } else {
      const [data, error] = await subscribeToOrganization(
        organization._id,
        body
      );
    }

    if (!error){
      await loggingLogEventWithProperties('user-subscribe-organization', {
        ref: orgRef?.code || orgRef?.ref || '',
        companyId: props?.id || organization?._id || '',
        url: window.location.href,
        date: moment().format('DD.MM.YYYY HH:mm:ss')
      })
    }
    if (error) {
      return;
    }
  };

  useEffect(() => {
    if (!organization || !user) return;

    if (user.contacts[0].subscriptions.find((s) => s == organization._id)) {
      setSubscribed(true);
    } else {
      setSubscribed(false);
    }
  }, [user, organization]);

  useEffect(() => {
    const check = checkIsApp();

    setIsApp(check);
  }, []);

  const handleSubscribeCompany = async (organizationId, inviteId) => {
    if (!user) {
      sessionStorage.setItem('organization-id', organizationId);
      sessionStorage.setItem('invite-id', inviteId);

      history.push(`/sign-up?next=${location.pathname}`);

      return null;
    }

    await onSubscribe();
  };

  const handleCheckInstallApp = async () => {
    const organizationId = !!organization ? organization._id : '';
    const inviteId = !!orgRef ? orgRef.ref : '';

    if (isApp) {
      const organizationId = !!organization ? organization._id : '';
      const inviteId = !!orgRef ? orgRef.ref : '';

      openCompanyPage({
        organizationId,
        inviteId,
      });

      setTimeout(async () => {
        await handleSubscribeCompany();
      }, 1000);

      return null;
    }

    await handleSubscribeCompany(organizationId, inviteId);
  };

  return (
    <div className='box box__subscribe'>
      <Profile background={background} primary={primary} logo={logo} />
      <SubscribeBox
        qrcode={qrcode}
        orgRef={orgRef}
        name={name}
        briefDescription={briefDescription}
        button={button}
        subscribed={subscribed}
        primary={primary}
        handleCheckInstallApp={handleCheckInstallApp}
      />
      <QrcodeViews qrcodeViews={qrcodeViews} orgRef={orgRef} qrcode={qrcode} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    organization: state.organization.organization,
    user: state.user.user,
    orgRef: state.organization.ref,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToOrganization: (organizationId, body) =>
      dispatch(
        actions.organization.subscribeToOrganization(organizationId, body)
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Subscribe));
