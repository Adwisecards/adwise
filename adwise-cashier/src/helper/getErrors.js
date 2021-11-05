export default function getError(error){
    const { status, data } = error;
    let errorMessage = {};

    if (typeof data.error === 'string'){
        return {
            title: 'Ошибка',
            message: data.error
        }
    }

    if (!data.error){
        switch (status.toString()){
            case '404': {
                errorMessage = error404

                break
            }
            case '500': {
                errorMessage = error500

                break
            }
        }
    }else{
        const { HTTPStatus, code, message, details } = data.error;

        errorMessage = errorBackend[`errorCode${ code.toUpperCase() }`];

        if (!errorMessage){
            return {
                title: 'Ошибка',
                message: message
            }
        }

        errorMessage.message += '\n' + details;
    }

    return errorMessage
}

const error404 = {
    title: 'Ошибка',
    message: 'Not found'
};
const error500 = {
    title: 'Ошибка',
    message: 'Not server'
};

const errorBackend = {
    errorCodeA: {
        title: 'Ошибка',
        message: 'Problem occured in process'
    },
    errorCodeB: {
        title: 'Ошибка',
        message: 'Not found'
    },
    errorCodeC: {
        title: 'Ошибка',
        message: 'Provided data is not valid.'
    },
    errorCodeD: {
        title: 'Ошибка',
        message: 'Access is forbidden'
    },
    errorCodeE: {
        title: 'Ошибка',
        message: 'Unauthenticated'
    },
    errorCodeF: {
        title: 'Ошибка',
        message: 'Conflict'
    },
    errorCodeG: {
        title: 'Ошибка',
        message: 'User with login does not exist'
    },
    errorCodeH: {
        title: 'Ошибка',
        message: 'Password is not correct'
    },
}
