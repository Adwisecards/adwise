import axios from 'axios';
import urls from "../constants/urls";

const axiosInstance = axios.create({
    baseURL: urls["prod-host"],
    headers: {
        authentication: localStorage.getItem('jwt')
    }
})

export default axiosInstance
