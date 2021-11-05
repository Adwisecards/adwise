import axios from 'axios';
import { config } from './config';
export const agent = axios.create({
    withCredentials: true,
    baseURL: config.apiURL,
    headers: {
        authentication: localStorage.getItem('jwt')
    }
});