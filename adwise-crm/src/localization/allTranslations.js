import i18n from 'i18n-js';

import ruRu from "./lang/locale_ru.json";
import enEn from "./lang/locale_en.json";

const langs = {
    "ru": ruRu,
    "en": enEn,
};

const allTranslations = (key, params) => {
    if (!key) {
        return key
    }

    const locale = i18n?.locale || 'ru';
    const lang = langs[locale];

    if (!lang) {
        return null
    }

    let message = getText(key, lang, ruRu);

    if (!message) {
        return key
    }

    if (!params) {
        return message
    }

    Object.keys((params)).map((key) => {
        const replaceKey = `${key}`;
        message = message.replace(new RegExp('{{'+ replaceKey +'}}','g'), params[key]);
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
