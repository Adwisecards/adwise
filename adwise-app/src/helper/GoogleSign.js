import * as Google from 'expo-google-app-auth';

const config = {
    clientId: 'addwise-291609'
};

const RegistrationFromGoogle = async () => {
    const { type, accessToken, user } = await Google.logInAsync(config);

    if (type === 'success') {
        let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        return userInfoResponse
    }

    return null
}

export {
    RegistrationFromGoogle
}
