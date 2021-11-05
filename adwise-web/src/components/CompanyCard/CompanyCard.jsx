import React from 'react';
import CompanyContacts from './CompanyContacts';
import AboutCompany from './AboutCompany/AboutCompany';
import Coupons from './Coupons/Coupons';
import CompanyServices from './CompanyServices/CompanyServices';
import Contacts from './Contacts.jsx/Contacts';
import LiveCompany from './LiveCompany/LiveCompany';
import Footer from './Footer';

import { Subscribe } from './components';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../store';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from "../../agent/agent";
import urls from "../../constants/urls";
import copyTextToClipboard from "../../helper/copyTextToClipboard";
import {loggingLogEventWithProperties} from "../../helper/Logging";

function CompanyCard({
  getOrganizationByInvitation,
  getRef,
  match,
  history,
  organization,
  setOrganization,
  ref,
  setRef,
  getOrganization,
}) {
  const [error, setError] = useState(null);
  const [codeUser, setCodeUser] = useState('');

  const getOrganizationByRefCode = async (code) => {
    let [ref, refError] = await getRef(code);

    if (refError) {
      history.replace('/not-found');
      return;
    }

    setRef(ref);
    let [organization, orgError] = await getOrganizationByInvitation(ref.ref);
    if (orgError) {
      history.replace('/not-found');
      return;
    }
    setOrganization(organization);
  };

  const getOrganizationById = async (id) => {
    let [organization, orgError] = await getOrganization(id);
    if (orgError) {
      history.replace('/not-found');
      return;
    }
    setOrganization(organization);
  };
  const getCodeUser = async (code) => {
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
    const organizationId = match.params.id;

    (async () => {
      await loggingLogEventWithProperties('user-open-organization', {
        ref: ref || '',
        organizationId: organizationId || '',
        url: window.location.href
      })
    })();

    if (organizationId) {
      getOrganizationById(organizationId);
      if (ref) {
        getOrganizationByRefCode(ref);

        (async () => {
          await getCodeUser(ref);
        })();
      }
      return;
    }
    return null;
  }, []);

  return (
    <div
      className='container container__company'
      style={{
        backgroundColor: organization
          ? `${organization.colors.primary}16`
          : '#0084ff16',
      }}
    >
      <div className='CompanyCard'>
        <div className='companyCard-header'>
          <Subscribe
            primary={organization ? organization.colors.primary : '#0084ff'}
            background={organization ? organization.mainPicture : ''}
            logo={organization ? organization.picture : ''}
            qrcode={organization ? organization.ref.QRCode : ''}
            briefDescription={organization ? organization.briefDescription : ''}
            name={organization ? organization.name : ''}
          />
          <CompanyContacts
            primary={organization ? organization.colors.primary : '#0084ff'}
            insta={organization ? organization.socialNetworks.insta : ''}
            vk={organization ? organization.socialNetworks.vk : ''}
            fb={organization ? organization.socialNetworks.fb : ''}
            phone={organization ? organization.phones[0] : ''}
            website={organization ? organization.website : ''}
          />
        </div>
        <Coupons
          primary={organization ? organization.colors.primary : '#0084ff'}
          coupons={organization ? organization.coupons : []}
        />
        <div className='companyCard-main'>
          <div className='companyCard-contacts'>
            <AboutCompany
              primary={organization ? organization.colors.primary : '#0084ff'}
              tags={organization ? organization.tags : []}
              description={organization ? organization.description : ''}
            />
            <Contacts
              primary={organization ? organization.colors.primary : '#0084ff'}
              coords={organization ? organization.address.coords : null}
              address={
                organization
                  ? `${organization.address.address}, ${organization.address.city}, ${organization.address.region}, ${organization.address.country}`
                  : ''
              }
              email={organization ? organization.emails[0] : ''}
              branchOffices={organization ? organization.branchOffices : []}
            />
          </div>
          <div className='companyCard-services'>
            <CompanyServices
              primary={organization ? organization.colors.primary : '#0084ff'}
              id={organization ? organization._id : null}
            />
            <LiveCompany />
          </div>
        </div>
      </div>
      <Footer
        primary={organization ? organization.colors.primary : '#0084ff'}
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOrganizationByInvitation: (id) =>
      dispatch(actions.organization.getOrganizationByInvitation(id)),
    getRef: (code) => dispatch(actions.organization.getRef(code)),
    setOrganization: (organization) =>
      dispatch(actions.organization.setOrganization(organization)),
    setRef: (ref) => dispatch(actions.organization.setRef(ref)),
    getOrganization: (id) =>
      dispatch(actions.organization.getOrganizationById(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    organization: state.organization.organization,
    invitationRef: state.organization.ref,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CompanyCard));
