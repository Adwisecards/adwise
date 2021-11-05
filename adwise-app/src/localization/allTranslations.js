import i18n from 'i18n-js';

import ruRu from "./lang/locale_ru.json";
import enEn from "./lang/locale_en.json";
import ptPt from "./lang/locale_pt.json";


import {getItemAsync} from "../helper/SecureStore";

const langs = {
    "ru": ruRu,
    "en": enEn,
    "pt": ptPt,
};

const allTranslations = (key, params) => {
    if (!key) {
        return 'Ключ не найден'
    }

    const locale = i18n.locale;
    const lang = langs[locale];

    if (!lang) {
        return null
    }

    let message = getText(key, lang, ruRu);

    if (!params) {
        return message
    }

    Object.keys((params)).map((key) => {
        message = message.replace(`{{${key}}}`, params[key]);
    });

    return message
};
const getText = (key, lang, langSpare) => {
    return key.replace(/\[([^\]]+)]/g, '.$1').split('.').reduce(function (o, p) {
        if (!o || !o[p]) {
            return key.replace(/\[([^\]]+)]/g, '.$1').split('.').reduce(function (o, p) {
                return o[p];
            }, langSpare)
        }

        return o[p];
    }, lang);
}

export default allTranslations
