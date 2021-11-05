import axios from "../plugins/axios";
import urls from "../constants/urls";

const scanQrCodeOrganization = async (params, props, updateAccount, setOpenLoading, closeModalQrCode, setActiveScan) => {

    setOpenLoading(true);

    let account = props.app.account;
    let accountId = props.app.activeCutaway;
    if (!accountId) {
        accountId = account.contacts[0]._id;
    }

    const response = await axios('put', urls["subscribe-to-organization"] + params.ref, {
        contactId: accountId
    }).then(response => {
        return true
    }).catch(error => {
        return null
    })

    if (!response) {

        props.navigation.navigate('CompanyPageMain', {
            organizationId: params.ref,
        });

        closeModalQrCode();
        setOpenLoading(false);
        setActiveScan(true);

        return null
    }

    await updateAccount();

    setOpenLoading(false);

    props.navigation.navigate('CompanyPageMain', {
        organizationId: params.ref,
    });

    closeModalQrCode();
    setActiveScan(true);
}

export {
    scanQrCodeOrganization
}
