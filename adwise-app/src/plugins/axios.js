import axios from 'axios';
import urls from '../constants/urls';
import {getItemAsync} from "../helper/SecureStore";
import Constants from 'expo-constants';
import Bugsnag from '@bugsnag/expo';

export default async (type, url, data) => {
  let token = await getItemAsync('jwt');

  let params = {
    headers: {
      'authentication': token,
      'app_version': Constants.manifest.version
    },
    withCredentials: false
  }

  url = urls["prod-host"] + url;

  switch (type) {
    case 'get': {
      if (data) {
        params['data'] = data
      }

      return axios({
          method: 'get',
          url: url,
          ...params
        }
      ).catch((error) => {
        console.log('error.response: ', error.response);

        let errorResponse = error.response.data;

        const message = {
          urls: url,
          method: 'get',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse.error.message,
          details: !errorResponse ? 'Ошибка сервера' : errorResponse.error.details,
          code: !errorResponse ? 'Ошибка сервера' : errorResponse.error.code,
        };

        Bugsnag.notify(JSON.stringify(message));

        return Promise.reject(error)
      })
    }
    case 'post': {
      return axios({
        method: 'post',
        url: url,
        data: data,
        ...params
      }).catch((error) => {
        let errorResponse = error?.response?.data;

        const message = {
          urls: url,
          method: 'post',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.message,
          details: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.details,
          code: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.code,
          body: data
        };

        Bugsnag.notify(JSON.stringify(message));

        return Promise.reject(error)
      })
    }
    case 'put': {
      return axios({
        method: 'put',
        url: url,
        data: data,
        ...params
      }).catch((error) => {
        let errorResponse = error.response.data;

        const message = {
          urls: url,
          method: 'put',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse.error.message,
          details: !errorResponse ? 'Ошибка сервера' : errorResponse.error.details,
          code: !errorResponse ? 'Ошибка сервера' : errorResponse.error.code,
          body: data
        };

        Bugsnag.notify(JSON.stringify(message));

        return Promise.reject(error)
      })
    }
    case 'delete': {
      return axios({
        method: 'delete',
        url: url,
        ...params
      }).catch((error) => {
        let errorResponse = error.response.data;

        const message = {
          urls: url,
          method: 'delete',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse.error.message,
          details: !errorResponse ? 'Ошибка сервера' : errorResponse.error.details,
          code: !errorResponse ? 'Ошибка сервера' : errorResponse.error.code
        };

        Bugsnag.notify(JSON.stringify(message));

        return Promise.reject(error)
      })
    }
  }
}
