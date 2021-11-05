import React, {Component} from "react";
import {
    Box,
    Grid,
    Typography,
    IconButton,
    Tooltip,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Snackbar,
    Popover, Menu
} from "@material-ui/core";
import {
    Download as DownloadIcon,
    FileText as FileTextIcon,
    Book as BookIcon
} from "react-feather";
import ExcelExport, { alignment } from 'export-xlsx';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import {Alert} from "@material-ui/lab";

// cards
import oldRuCards from "./translations/cards/old-ru-RU.json";
import ruRuCards from "./translations/cards/ru-RU.json";
import enEnCards from "./translations/cards/en-EN.json";
import ptPtCards from "./translations/cards/pt-PT.json";
import arArCards from "./translations/cards/ar-AR.json";

// crm
import oldRuCrm from "./translations/crm/old_locale_ru.json";
import ruRuCrm from "./translations/crm/locale_ru.json";
import enEnCrm from "./translations/crm/locale_en.json";
import ptPtCrm from "./translations/crm/locale_pt.json";

const languages = {
    ruRuCards,
    enEnCards,
    ptPtCards,
    arArCards,

    ruRuCrm,
    enEnCrm,
    ptPtCrm
};
const SETTINGS_FOR_EXPORT = {
    fileName: 'change-russian-word',
    workSheets: [
        {
            sheetName: 'example',
            startingRowNumber: 1,
            gapBetweenTwoTables: 1,
            tableSettings: {
                data: {
                    importable: true,
                    headerDefinition: [
                        {
                            name: 'Ключ переменной',
                            key: 'key',
                            width: 30,
                            hierarchy: true,
                            checkable: true,
                            style: { alignment: alignment.middleLeft },
                            headerStyle: { alignment: alignment.middleLeft },
                        },
                        {
                            name: 'Русское слово',
                            key: 'russian_word',
                            width: 150,
                            hierarchy: true,
                            checkable: true,
                            style: { alignment: alignment.middleLeft },
                            headerStyle: { alignment: alignment.middleLeft }
                        },
                    ],
                },
            },
        },
    ],
};

class Language extends Component {
    constructor(props) {
        super(props);

        this.state = {
            json: {},
            changed: {},
            changedCrm: {},

            language: ""
        };
    }

    componentDidMount = () => {
        const changed = this.onCheckChangeTranslate(ruRuCards, oldRuCards);
        const changedCrm = this.onCheckChangeTranslate(ruRuCrm, oldRuCrm);

        if (Object.keys(changed).length > 0){
            this.setState({
                changed,
                isOpenSnackbar: true
            });
        }
        if (Object.keys(changedCrm).length > 0){
            this.setState({
                changedCrm,
                isOpenSnackbar: true
            });
        }
    }

    onCheckChangeTranslate = (currentTranslate, oldTranslate) => {
        let newKeys = {};

        Object.keys(currentTranslate).map((key) => {
            if (typeof currentTranslate[key] === "object"){
                const changed = this.onCheckChangeTranslate(currentTranslate[key], oldTranslate[key] || {});

                if (Object.keys(changed).length > 0){
                    newKeys[key] = changed;
                }
            } else {
                if (!oldTranslate || typeof oldTranslate[key] === "undefined") {
                    newKeys[key] = currentTranslate[key]
                }
            }
        })

        return newKeys
    }

    onChange = (json) => {
        this.setState({json});
    }
    onChangeLanguage = (language) => {
        const ruRu = this._getRussianTranslate();
        const data = this.onCheckingCompletenessTongue(languages[language], ruRu);
        let json = JSON.stringify(data);
        json = json.replaceAll('\\n', '/');

        this.setState({
            language,
            json: JSON.parse(json)
        });
    }
    onCheckingCompletenessTongue = (language, ruRu) => {
        Object.keys(ruRu).map((keyFullLanguage) => {
            if (!Boolean(language[keyFullLanguage])) {
                language[keyFullLanguage] = this.onClearJSONValue(ruRu[keyFullLanguage]);
            }
            if (typeof language[keyFullLanguage] === 'object') {
                language[keyFullLanguage] = this.onCheckingCompletenessTongue(language[keyFullLanguage], ruRu[keyFullLanguage]);
            }
        });

        return language
    };
    onClearJSONValue = (json) => {
        return json
    }

    onExport = () => {
        let json = JSON.stringify(this.state.json);
        json = json.replaceAll('/', '\\n');
        const filename = `${this.state.language}.json`;
        const jsonStr = json;

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();

        document.body.removeChild(element);
    }
    onExportLanguage = () => {
        let changed = {...this.state.json};
        const getList = function (changed) {
            let value = []

            Object.keys(changed).map((key) => {
                if (typeof changed[key] === "object"){
                    value = value.concat(getList(changed[key]));
                } else {
                    value.push({
                        key: key,
                        russian_word: changed[key]
                    });
                }
            });

            return value
        }

        const dataExport = [
            {
                data: getList(changed),
                tableSettings: {
                    style: { alignment: alignment.middleLeft },
                    headerStyle: { alignment: alignment.middleLeft }
                }
            }
        ];
        const excelExport = new ExcelExport();
        excelExport.downloadExcel({
            ...SETTINGS_FOR_EXPORT,
            fileName: this.state.language
        }, dataExport);
    }
    onExportChanged = (name) => {
        const fileName = Boolean(name === 'cards') ? 'cards-change-russian-word' : 'crm-change-russian-word';
        let changed = Boolean(name === 'cards') ? {...this.state.changed} : {...this.state.changedCrm};

        const getList = function (changed) {
            let value = []

            Object.keys(changed).map((key) => {
                if (typeof changed[key] === "object"){
                    value = value.concat(getList(changed[key]));
                } else {
                    value.push({
                        key: key,
                        russian_word: changed[key]
                    });
                }
            });

            return value
        }

        const dataExport = [
            {
                data: getList(changed),
                tableSettings: {
                    style: { alignment: alignment.middleLeft },
                    headerStyle: { alignment: alignment.middleLeft }
                }
            }
        ];
        const excelExport = new ExcelExport();
        excelExport.downloadExcel({
            ...SETTINGS_FOR_EXPORT,
            fileName
        }, dataExport);
    }

    _getRussianTranslate = () => {
        const language = this.state.language;

        if (language === 'ruRuCards' || language === 'enEnCards' || language === 'ptPtCards' || language === 'arArCards') {
            return ruRuCards
        }
        if (language === 'ruRuCrm' || language === 'enEnCrm' || language === 'ptPtCrm') {
            return ruRuCrm
        }

        return {}
    }


    render() {
        const {json, changed, changedCrm, isOpenSnackbar, language} = this.state;

        const russianTranslate = this._getRussianTranslate();

        return (
            <>

                <Box mb={3}>
                    <Grid container spacing={1} alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h1">Переводы</Typography>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Tooltip title="Экспорт всего словаря">
                                        <IconButton onClick={this.onExportLanguage}>
                                            <BookIcon color="#8152E4"/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <PopupState variant="popover" popupId="demo-popup-popover">
                                        {(popupState) => (
                                            <div>

                                                <Tooltip title="Экспорт измененных слов">
                                                    <IconButton disabled={Object.keys(changed).length <= 0} {...bindTrigger(popupState)}>
                                                        <FileTextIcon color="#8152E4"/>
                                                    </IconButton>
                                                </Tooltip>

                                                <Popover
                                                    {...bindPopover(popupState)}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'center',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'center',
                                                    }}
                                                >
                                                    <MenuItem onClick={() => this.onExportChanged('cards')}>AdWise Cards</MenuItem>
                                                    <MenuItem onClick={() => this.onExportChanged('crm')}>AdWise CRM</MenuItem>
                                                </Popover>
                                            </div>
                                        )}
                                    </PopupState>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Экспорт перевода">
                                        <IconButton onClick={this.onExport}>
                                            <DownloadIcon color="#8152E4"/>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={4}>
                    <Box width={350}>
                        <FormControl margin="normal" fullWidth>
                            <Select
                                variant="outlined"
                                value={language}
                                onChange={({target}) => this.onChangeLanguage(target.value)}
                            >
                                <MenuItem value="">Сбросить</MenuItem>
                                <MenuItem value="ruRuCards">AdWise Cards (Русский)</MenuItem>
                                <MenuItem value="enEnCards">AdWise Cards (English)</MenuItem>
                                <MenuItem value="ptPtCards">AdWise Cards (Português)</MenuItem>
                                <MenuItem value="arArCards">AdWise Cards (Арабский)</MenuItem>
                                <MenuItem value="ruRuCrm">AdWise CRM (Русский)</MenuItem>
                                <MenuItem value="enEnCrm">AdWise CRM (English)</MenuItem>
                                <MenuItem value="ptPtCrm">AdWise CRM (Português)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Typography variant="subtitle1">Символ "/" означает перенос слова в мобильном приложении. Символ "br" или "br/" означает перенос слова в CRM или WEB. Просьба не удалять, и его соблюдать.</Typography>
                    <Typography variant="subtitle1">Символы "&#123;&#123;phone&#125;&#125;" означает замена переменной на данные приложения, просьба соблюдать данный синтаксис, иначе приложение будет работать некоректно.</Typography>
                </Box>

                <Box>
                    {
                        Object.keys(json).map((key) => {
                            return (
                                <FormJson
                                    level={0}
                                    json={json}
                                    title={key}
                                    currentKey={key}
                                    russianTranslate={russianTranslate[key]}

                                    onChange={this.onChange}
                                />
                            )
                        })
                    }
                </Box>

                <Snackbar
                    open={isOpenSnackbar}
                    autoHideDuration={9000}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    onClose={() => this.setState({isOpenSnackbar: false})}
                >
                    <Alert onClose={() => this.setState({isOpenSnackbar: false})} severity="error">
                        Найдены изменения в переводе:<br/>
                        AdWise Cards - {Object.keys(changed).length}<br/>
                        AdWise CRM - {Object.keys(changedCrm).length}<br/>
                    </Alert>
                </Snackbar>

            </>
        );
    }
}

const FormJson = (props) => {
    const {level, json, title, currentKey, onChange, russianTranslate} = props;

    if (!json || !russianTranslate) {
        return null
    }

    const handleOnChange = ({target}) => {
        const {name, value} = target;

        let newJson = {...json};
        let newItem = {...json[currentKey]};
        newItem[name] = value;
        newJson[currentKey] = newItem;

        onChange(newJson)
    }
    const handleOnChangeItem = (item) => {
        let newJson = {...json};
        newJson[currentKey] = item;

        onChange(newJson)
    }

    const item = json[currentKey];

    return (
        <Box ml={level}>

            {
                title && (
                    <Typography variant="h4">{title}</Typography>
                )
            }

            {
                Object.keys(item).map((key) => {
                    const isObject = Boolean(typeof item[key] === 'object');

                    if (isObject) {
                        return (
                            <FormJson
                                level={level + 1}
                                json={item}
                                title={key}
                                currentKey={key}
                                russianTranslate={russianTranslate[key]}

                                onChange={handleOnChangeItem}
                            />
                        )
                    }

                    return (
                        <Box mb={1}>
                            <Typography variant="subtitle1">{key}</Typography>

                            <TextField
                                value={item[key]}
                                name={key}
                                onChange={handleOnChange}
                                fullWidth
                                variant="outlined"
                            />

                            <Typography variant="caption">Русский перевод: {russianTranslate[key] || key}</Typography>
                        </Box>
                    )
                })
            }

        </Box>
    )
}

export default Language
