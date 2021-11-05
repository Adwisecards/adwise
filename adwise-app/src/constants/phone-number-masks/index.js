import {} from './icons/_index';
import {
    russia,
    ukraine,
    belarus
} from './assets';

export default [
    {
        "id": "0",
        "code": "+7",
        "codeLength": 1,
        "useIcon": false,
        "icon": russia,
        "name": "Россия",
        "mask": "(999) 999-99-99",
        "placeholder": "(___) ___-__-__",
        "language": ['ru-RU'],
        "lengthPhone": 11,
        "regular": "^\\+7\\(\\d{3}\\)\\s\\d{3}-\\d{2}-\\d{2}$",
        "regularTransform": [/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4']
    },
    {
        "id": "1",
        "code": "+380",
        "codeLength": 3,
        "useIcon": false,
        "icon": ukraine,
        "name": "Украина",
        "mask": "99-999-99-99",
        "placeholder": "__-___-__-__",
        "language": ['ru-RU'],
        "lengthPhone": 12,
        "regular": "^\\+380\\d{2}-\\d{3}-\\d{2}-\\d{2}$"
    },
    {
        "id": "2",
        "code": "+375",
        "codeLength": 3,
        "useIcon": false,
        "icon": belarus,
        "name": "Беларусь",
        "mask": "(99) 999-99-99",
        "placeholder": "(__) ___-__-__",
        "language": ['ru-RU'],
        "lengthPhone": 12,
        "regular": "^\\+375\\(\\d{2}\\)\\s\\d{3}-\\d{2}-\\d{2}$"
    }
]
