import {

    individualGetBodyFromForm as russiaIndividualGetBodyFromForm,
    individualGetFormFromBody as russiaIndividualGetFormFromBody,
    ipGetBodyFromForm as russiaIpGetBodyFromForm,
    ipGetFormFromBody as russiaIpGetFormFromBody,
    oooGetBodyFromForm as russianOooGetBodyFromForm,
    oooGetFormFromBody as russianOooGetFormFromBody,

} from "./russia";

const getBodyFromForm = (organization) => {

    let body;

    if (organization.legal.form === 'individual') {
        body = russiaIndividualGetBodyFromForm(organization);
    }
    if (organization.legal.form === 'ip') {
        body = russiaIpGetBodyFromForm(organization);
    }
    if (organization.legal.form === 'ooo') {
        body = russianOooGetBodyFromForm(organization);
    }

    return body;

}
const getFormFromBody = (organization, legal) => {

    let form;

    if (legal.form === 'individual') {
        form = russiaIndividualGetFormFromBody(organization, legal);
    }
    if (legal.form === 'ip') {
        form = russiaIpGetFormFromBody(organization, legal);
    }
    if (legal.form === 'ooo') {
        form = russianOooGetFormFromBody(organization, legal);
    }

    return form

}

export {
    getBodyFromForm,
    getFormFromBody,
}
