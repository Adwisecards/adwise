import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_PRODUCTION_HOST_API,
    headers: {
        authentication: localStorage.getItem('jwt')
    }
})

export default axiosInstance
