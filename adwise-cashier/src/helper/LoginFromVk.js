import * as AuthSession from 'expo-auth-session';

const LoginFromVk = async () => {
    let result = await AuthSession.startAsync({
        authUrl: 'https://oauth.vk.com/authorize?client_id=587459851&display=mobile&response_type=token&v=5.92',
    });

    return result
}

export {
    LoginFromVk
}
