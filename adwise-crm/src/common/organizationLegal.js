import axiosInstance from "../agent/agent";
import urls from "../constants/urls";

const getLegalOrganization = async (organizationId) => {
    return await axiosInstance.get(`${ urls['legal-get-form'] }/${ organizationId }`).then((res) => {
        return res.data.data.legal
    }).catch((err) => {
        return {}
    })
}
const setLegalOrganization = async (organization, legal, relevant = false) => {

    const body = {
        organizationId: organization._id,
        country: legal?.country || 'rus',
        form: legal.form,
        info: legal.info,
        relevant: relevant
    };

    return await axiosInstance.post(urls["legal-send-form"], body).then((res) => {
        return res.data.data.legalId
    }).catch((err) => {
        return {
            error: err.response
        }
    });

}

export {
    getLegalOrganization,
    setLegalOrganization
}
