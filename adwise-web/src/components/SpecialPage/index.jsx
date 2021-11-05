import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../store';
import { useState } from 'react';
import { useEffect } from 'react';

import { Subscribe } from './components';

import CompanyContacts from '../CompanyCard/CompanyContacts';
import Footer from '../CompanyCard/Footer';
import SpecialItem from './SpecialItem';
import axiosInstance from "../../agent/agent";
import urls from "../../constants/urls";
import copyTextToClipboard from "../../helper/copyTextToClipboard";
import {loggingLogEventWithProperties} from "../../helper/Logging";
import moment from "moment";

const SpecialPage = ({
  match,
  getOrganizationByInvitation,
  getRef,
  ref,
  history,
  organization,
  setOrganization,
  getOrganization,
  getCoupon,
  setCouponRef,
}) => {
  const [coupon, setCoupon] = useState([]);
  const [error, setError] = useState(null);
  const [refCoupon, setRefCoupon] = useState(null);

  const getCouponById = async (id) => {
    let [coupon, coupError] = await getCoupon(id);
    if (coupError) {
      history.replace('/not-found');
      return;
    }
    setCoupon(coupon);

    let [organization, orgError] = await getOrganization(coupon.organization);
    if (orgError) {
      history.replace('/not-found');
      return;
    }
  };

  const getOrganizationByRefCode = async (code) => {
    let [ref, refError] = await getRef(code);

    if (refError) {
      history.replace('/not-found');
      return;
    }

    setCouponRef(ref);
    setRefCoupon(ref);

    let [organization, orgError] = await getOrganizationByInvitation(ref.ref);
    if (orgError) {
      history.replace('/not-found');
      return;
    }
    setOrganization(organization);
  };
  const getUserCode = async (code) => {
    const invitation = await axiosInstance.get(`${urls["invite-get-ref"]}${code}`).then((response) => {
      return response.data.data.ref
    }).catch((error) => {
      return null
    });

    if (!invitation) {
      return null
    }

    const user = await axiosInstance.get(`${urls["get-user-by-invitation"]}${invitation.ref}`).then((response) => {
      return response.data.data.user
    }).catch((error) => {
      return null
    });

    if (!user) {
      return null
    }

    copyTextToClipboard(user.ref.code);
  }

  useEffect(() => {
    const ref = match.params.ref;
    const couponId = match.params.id;

    (async () => {
      await loggingLogEventWithProperties('user-open-coupon', {
        ref: ref || '',
        couponId: couponId,
        url: window.location.href
      })
    })();

    if (couponId) {
      getCouponById(couponId);
      if (ref) {
        getOrganizationByRefCode(ref);
        getUserCode(ref);
      }
      return;
    }
    return null;
  }, []);

  return (
    <div className='container container__company container__company_special'>
      <div className='CompanyCard'>
        <div className='companyCard-header'>
          <Subscribe
            coupon={coupon}
            organization={organization}
            id={organization ? organization._id : ''}
            background={organization ? organization.mainPicture : ''}
            logo={organization ? organization.picture : ''}
            briefDescription={organization ? organization.briefDescription : ''}
            name={organization ? organization.name : ''}
            button={false}
            qrcodeViews={false}
          />
          <CompanyContacts
            insta={organization ? organization.socialNetworks.insta : ''}
            vk={organization ? organization.socialNetworks.vk : ''}
            fb={organization ? organization.socialNetworks.fb : ''}
            phone={organization ? organization.phones[0] : ''}
            website={organization ? organization.website : ''}
          />
        </div>

        <SpecialItem
          name={coupon ? coupon.name : ''}
          description={coupon ? coupon.description : ''}
          quantity={coupon ? coupon.quantity : ''}
          initialQuantity={coupon ? coupon.initialQuantity : ''}
          distributionSchema={coupon ? coupon.distributionSchema : null}
          offer={coupon ? coupon.offer : null}
          price={coupon ? coupon.price : 0}
          qrcode={refCoupon?.QRCode || ''}
          coupon={coupon}
        />
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    organization: state.organization.organization,
    user: state.user.user,
    couponRef: state.organization.couponRef,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCoupon: (id) => dispatch(actions.organization.getCouponById(id)),
    setOrganization: (organization) =>
      dispatch(actions.organization.setOrganization(organization)),
    getOrganization: (id) =>
      dispatch(actions.organization.getOrganizationById(id)),
    getOrganizationByInvitation: (id) =>
      dispatch(actions.organization.getOrganizationByInvitation(id)),
    getRef: (code) => dispatch(actions.organization.getRef(code)),
    setOrganization: (organization) =>
      dispatch(actions.organization.setOrganization(organization)),
    setCouponRef: (ref) => dispatch(actions.organization.setCouponRef(ref)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SpecialPage));
