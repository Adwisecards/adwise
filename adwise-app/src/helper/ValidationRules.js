const validationFields = (fields, rules) => {
    let info = {
        error: {},
        status: ''
    };

    for(let key in fields){
        let errorList = [];
        let item = fields[key];

        if (!rules[key]){
            break
        }

        if (rules[key].indexOf('required') > -1){
            if (!item || item === ''){
                errorList.push('required')
            }
        }

        if (errorList.length > 0){
            info.error[key] = errorList;
        }
    }

    if (Object.keys(info.error).length > 0){
        info.status = 'error'
    }else{
        info.status = 'success'
    }

    return info
}

export {
    validationFields
}
