// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setItemAsync = async (key, value, options) => {
    value = JSON.stringify(value);

    await AsyncStorage.setItem(key, value, options);
}
const getItemAsync = async (key, options) => {
    let value = await AsyncStorage.getItem(key, options);

    if (!value){
        return null
    }

    value = JSON.parse(value);

    return value
}
const deleteItemAsync = async (key, options) => {
    await AsyncStorage.removeItem(key, options);
}

export {
    setItemAsync,
    getItemAsync,
    deleteItemAsync
}
