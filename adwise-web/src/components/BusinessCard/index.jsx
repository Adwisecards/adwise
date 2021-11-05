import React from 'react'
import Footer from '../CompanyCard/Footer'
import CustomContacts from '../customComponents/customContacts'
import CustomSubscribe from '../customComponents/customSubscribe'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { actions } from '../../store';
import { useState } from 'react';
import { useEffect } from 'react';

function BusinessCard ({getContact, match, history,}){
    const [contact, setContact] = useState(null)
    const getContactById = async id => {
        let [contact, orgError] = await getContact(id);
        if (orgError) {
            history.replace('/not-found');
            return;
        }
        setContact(contact);

    };

    useEffect(() => {
        const contactId = match.params.id;
        if (contactId) {
            getContactById(contactId);
            return;
        }
        return null;
    }, []);
    return(
        <div className='container container__company container__company-business-card' >
             {contact
             ?(<div className='business-card-box'>
             <CustomSubscribe
             organization={contact.organization}
             qrcode={contact.requestRef.QRCode}
             briefDescription={contact.activity.value ? contact.activity.value : ''}
             name={`${contact.firstName.value} ${contact.lastName.value}`}
             logo={contact.picture.value}
             color={contact.color}
             />
             <CustomContacts
             inst={contact.socialNetworks.insta.value}
             vk={contact.socialNetworks.vk.value}
             fb={contact.socialNetworks.fb.value}
             site={contact.website.value}
             email={contact.email.value}
             phone={contact.phone.value}
             color={contact.color}/>
            </div>)
             : null}

            <Footer/>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        getContact: id => dispatch(actions.organization.getContactById(id)),
        ///

    };
};

const mapStateToProps = state => {
    return {
        organization: state.organization.organization,
        invitationRef: state.organization.ref
        ////
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BusinessCard));
