import {

    individualGetFormFromBody as russiaIndividualGetFormFromBody,
    ipGetFormFromBody as russiaIpGetFormFromBody,
    oooGetFormFromBody as russianOooGetFormFromBody,

} from "./russia";

const getFormFromBody = (legal) => {

    let form;

    if (!legal) {
        return null
    }


    if (legal.form === 'individual') {
        form = russiaIndividualGetFormFromBody( {}, legal);
    }
    if (legal.form === 'ip') {
        form = russiaIpGetFormFromBody({}, legal);
    }
    if (legal.form === 'ooo') {
        form = russianOooGetFormFromBody({}, legal);
    }

    return form

}

export {
    getFormFromBody,
}
