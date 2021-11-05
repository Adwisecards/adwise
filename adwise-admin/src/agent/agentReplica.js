import axios from 'axios';

const axiosInstanceReplica = axios.create({
    baseURL: process.env.REACT_APP_PRODUCTION_HOST_API_REPLICA,
    headers: {
        authentication: localStorage.getItem('jwt')
    }
})

export default axiosInstanceReplica
