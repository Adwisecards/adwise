import Bugsnag from '@bugsnag/expo';
import axios from 'axios';
import urls from '../constants/urls';
import Constants from 'expo-constants';
import {getItemAsync} from "../helper/SecureStore";
import {Platform} from "react-native";

export default async (type, url, data, headers) => {
  let token = await getItemAsync('jwt');

  let params = {
    headers: {
      'authentication': token,
      'app_version': Constants.manifest.version,
      ...headers
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
      ).catch(async (error) => {
        let errorResponse = error?.response?.data || true;

        const message = {
          urls: url,
          method: 'get',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.message || '',
          details: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.details || '',
          code: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.code || '',
        };

        console.log('message: ', message)

        await sendMessageLogging(message)
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
      }).catch(async (error) => {
        let errorResponse = error?.response?.data || true;

        const message = {
          urls: url,
          method: 'post',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.message || '',
          details: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.details || '',
          code: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.code || '',
          body: data
        };

        await sendMessageLogging(message)
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
      }).catch(async (error) => {
        let errorResponse = error.response.data;

        const message = {
          urls: url,
          method: 'put',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.message || '',
          details: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.details || '',
          code: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.code || '',
          body: data
        };

        await sendMessageLogging(message)
        Bugsnag.notify(JSON.stringify(message));

        return Promise.reject(error)
      })
    }
    case 'delete': {
      return axios({
        method: 'delete',
        url: url,
        ...params
      }).catch(async (error) => {
        let errorResponse = error.response.data;

        const message = {
          urls: url,
          method: 'delete',
          message: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.message || '',
          details: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.details || '',
          code: !errorResponse ? 'Ошибка сервера' : errorResponse?.error?.code || '',
        };

        await sendMessageLogging(message)
        Bugsnag.notify(JSON.stringify(message));

        return Promise.reject(error)
      })
    }
  }
}

const sendMessageLogging = async (message) => {
  console.log('message: ', message)

  const body = {
    event: "error-from-business",
    message: JSON.stringify(message),
    platform: Platform.OS,
    app: 'business',
    isError: true
  }

  await axios.post(`${urls["prod-host"]}${urls["log-create-log"]}`, body)
}
