import * as SecureStore from 'expo-secure-store';

const setItemAsync = async (key, value, options) => {
    value = JSON.stringify(value);

    await SecureStore.setItemAsync(key, value, options);
}
const getItemAsync = async (key, options) => {
    let value = await SecureStore.getItemAsync(key, options);

    if (!value){
        return null
    }

    value = JSON.parse(value);

    return value
}
const deleteItemAsync = async (key, options) => {
    await SecureStore.deleteItemAsync(key, options);
}

export {
    setItemAsync,
    getItemAsync,
    deleteItemAsync
}
