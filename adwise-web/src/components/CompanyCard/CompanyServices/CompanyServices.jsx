import React from 'react';
import Service from './Service';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { actions } from '../../../store';

function CompanyServices({id, getServices, primary='#0084ff'}) {
    const [services, setServices] = useState([]);
    
    const getServicesById = async id => {
        const [services, error] = await getServices(id);

        if (error) {
            return;
        }
        setServices(services);
    };
    useEffect(() => {
        if(!id){
           return null 
        }
        getServicesById(id) 
        return;
    }, [id]);

    return (
        <div className='about-company' style={services.length?{display:"block"}: {display:"none"}}>
            <h2 className='extange__h2 box__h2_section'>Услуги</h2>
            <div className='box box__services'>
                { services 
                    ? services.map(service => {
                        if(service !== undefined){
                            return <Service primary={primary} key={service._id} id={service._id} service={service} />;
                        }
                        })
                    : null
                }
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        getServices: id => dispatch(actions.organization.getServices(id))
    };
};

export default connect(null, mapDispatchToProps)(CompanyServices);
