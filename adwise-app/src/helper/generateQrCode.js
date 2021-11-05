const generateQrCode = (params) => {
    let data = {
        mode: params.mode,
    };

    if (params.mode === 'contact'){
        data.data = {
            type: params.type,
            user_id: params.user_id,
            user_name: params.user_name
        }
    }
    if (params.mode === 'coupon'){}


    return JSON.stringify(data)
}

const readQrCode = (data) => {}

export {
    generateQrCode, readQrCode
}
