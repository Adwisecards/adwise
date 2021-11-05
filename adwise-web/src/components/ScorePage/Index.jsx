import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../store';
import { useState } from 'react';
import { useEffect } from 'react';
import { Subscribe } from './components';
import CompanyContacts from '../CompanyCard/CompanyContacts';
import ScoreItem from './ScoreItem/Index';
import Footer from '../CompanyCard/Footer';

const ScorePage = ({
  match,
  history,
  organization,
  setOrganization,
  getOrganization,
  getPurchase,
}) => {
  const [purchase, setPurchase] = useState([]);
  const [error, setError] = useState(null);
  const score = {
    number: '000-25-789',
    date: '17.11.2020 18:46',
    status: 'НОВЫЙ / НЕОЛАЧЕН',
    codeUser: '895-752-554',
    qrcode: '/img/company-qr.svg',
    copyCode: '789565484634',
    products: [
      {
        title: 'Инвекторный кондиционер mitsubishi 1100-50k',
        quantity: 2,
        price: 2550,
        sum: 5100,
      },
      {
        title: 'Пароотчиститель Kielo 1800',
        quantity: 1,
        price: 4200,
        sum: 4200,
      },
      {
        title: 'Вытяжка mitsubishi 1100-50k',
        quantity: 1,
        price: 18500,
        sum: 18500,
      },
      {
        title: 'Приточная вентиляция Kielo 1800',
        quantity: 10,
        price: 4200,
        sum: 42000,
      },
    ],
  };

  const getPurchaseById = async (id) => {
    let [purchase, orgError] = await getPurchase(id);
    if (orgError) {
      history.replace('/not-found');
      return;
    }
    setPurchase(purchase);

    getOrganizationById(purchase.organization);
  };

  const getOrganizationById = async (id) => {
    let [organization, orgError] = await getOrganization(id);
    if (orgError) {
      history.replace('/not-found');
      return;
    }
    setOrganization(organization);
  };

  useEffect(() => {
    const code = match.params.code;
    const purchaseId = match.params.id;
    if (purchaseId) {
      getPurchaseById(purchaseId);
      return;
    }

    return null;
  }, []);
  return (
    <div className='container container__company'>
      <div className='CompanyCard'>
        <div className='companyCard-header'>
          <Subscribe
            id={organization ? organization._id : ''}
            background={organization ? organization.mainPicture : ''}
            logo={organization ? organization.picture : ''}
            qrcode={organization ? organization.ref.QRCode : ''}
            briefDescription={organization ? organization.briefDescription : ''}
            name={organization ? organization.name : ''}
          />
          <CompanyContacts
            insta={organization ? organization.socialNetworks.insta : ''}
            vk={organization ? organization.socialNetworks.vk : ''}
            fb={organization ? organization.socialNetworks.fb : ''}
            phone={organization ? organization.phones[0] : ''}
            website={organization ? organization.website : ''}
          />
        </div>
        <ScoreItem
          number={score ? score.number : ''}
          date={score ? score.date : ''}
          status={score ? score.status : ''}
          codeUser={score ? score.codeUser : ''}
          qrcode={score ? score.qrcode : ''}
          copyCode={score ? score.copyCode : ''}
          products={score.products ? score.products : []}
        />
      </div>
      <Footer />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPurchase: (id) => dispatch(actions.organization.getPurchaseById(id)),
    setOrganization: (organization) =>
      dispatch(actions.organization.setOrganization(organization)),
    getOrganization: (id) =>
      dispatch(actions.organization.getOrganizationById(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    organization: state.organization.organization,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ScorePage));
