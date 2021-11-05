import {
    GoogleSignin,
    statusCodes
} from '@react-native-community/google-signin';

const signIn = async () => {
    try {
        // GoogleSignin.configure();

        const userInfo = await GoogleSignin.signInSilently();

        // await GoogleSignin.hasPlayServices();
        // const userInfo = await GoogleSignin.signIn();

        return {
            status: 'SUCCESS',
            userInfo: userInfo
        }
    } catch (error) {
        // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        //     return {
        //         status: 'SIGN_IN_CANCELLED'
        //     }
        // } else if (error.code === statusCodes.IN_PROGRESS) {
        //     return {
        //         status: 'IN_PROGRESS'
        //     }
        // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        //     return {
        //         status: 'PLAY_SERVICES_NOT_AVAILABLE'
        //     }
        // } else {
        //     return {
        //         status: 'ERROR'
        //     }
        // }
    }
}

export {
    signIn
}
