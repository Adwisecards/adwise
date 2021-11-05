const getErrorMessage = (error) => {
    let title;
    let message;

    const response = error.response;

    if (!response){
        return errors["502"]
    }

    const serverError = response.data.error;

    switch (serverError.code){
        case 'a': {
            title = 'Ошибка';
            message = serverError.message;

            break
        }
        case 'b': {
            title = 'Ошибка';
            message = serverError.message;

            break
        }
        case 'c': {
            title = 'Ошибка';
            message = serverError.details;

            break
        }
        default: {
            title = 'Ошибка';
            message = `${ serverError.message }\n${ serverError.details }`;
        }
    }

    return {
        title,
        message
    }
}


const errors = {
    '502': {
        title: 'Ошибка',
        message: 'Не удалось подключиться к серверу'
    },

    'c': {
        title: 'Ошибка',
        message: ''
    }
}

export default getErrorMessage
