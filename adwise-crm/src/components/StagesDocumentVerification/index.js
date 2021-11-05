import React from "react";
import {
    Box,
    Grid,
    Link, Tooltip,
    Typography,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {compose} from "recompose";
import {connect} from "react-redux";

import multiDownload from "multi-download";
import {useHistory} from "react-router-dom";
import clsx from "clsx";
import {HelpBadge} from "../index";

const StagesDocumentVerification = (props) => {
    const { organization } = props;

    const classes = useStyles();
    const history = useHistory();

    if (organization.signed) {
        return null
    }

    const handleDownloadRar = async () => {
        const application = organization.application;
        const treaty = organization.treaty;

        let files = [];

        if (!!application) {
            const file = await handleGetFileFromLink(application, 'application.pdf');

            if (file) {
                const fileBlog = URL.createObjectURL(new Blob([file], {type: 'application/pdf'}))
                files.push(fileBlog)
            }
        }
        if (!!treaty) {
            const file = await handleGetFileFromLink(treaty, 'treaty.pdf');

            if (file) {
                const fileBlog = URL.createObjectURL(new Blob([file], {type: 'application/pdf'}));
                files.push(fileBlog)
            }
        }

        multiDownload(files);
    }
    const handleGetFileFromLink = async (url, name, defaultType = 'application/pdf') => {
        const response = await fetch(url).catch((error) => {
            window.open(url);
        });

        if (!response) {
            return null
        }

        const data = await response.blob();
        return new File([data], name, {
            type: response.headers.get('content-type') || defaultType,
        });
    }

    return (
        <Box px={4} py={3} borderRadius={8} className={classes.root}>

            <Typography className={ classes.typographyBold }>Для полноценной работы с CRM:</Typography>

            <Typography className={classes.typography}>
                <Typography className={classes.typography}>1.&nbsp;</Typography>
                <Typography className={classes.typography}>Корректно заполнить все данные по своему бизнесу</Typography>
            </Typography>

            <Typography className={classes.typography}>
                <Typography className={classes.typography}>2.&nbsp;</Typography>
                {/*<Typography className={classes.typographyButton} onClick={handleDownloadRar}>Скачать</Typography>*/}
                <Typography className={classes.typography}>Скачать документы во вкладке Реквизиты</Typography>
                {/*<Typography className={classes.typographyBold}>подписать</Typography>*/}
            </Typography>

            <Typography className={classes.typography}>
                3.&nbsp;Подписать Акт о предоставлении прав и с остальными&nbsp;<Tooltip title={<TooltipComponent/>} arrow><div>документами*</div></Tooltip>&nbsp;<span onClick={() => history.push('/application-form')} style={{fontWeight: "500", textDecoration: "underline", cursor: "pointer"}}>отправить</span>&nbsp;для выставления счёта
            </Typography>

            <Typography className={classes.typography}>
                <Typography className={classes.typography}>4.&nbsp;Оплатите счёт и после подтверждения Ваш бизнес активируют в системе</Typography>
            </Typography>

            {/*<Typography className={classes.typography}>*/}
            {/*    <Typography className={classes.typography}>3. </Typography>*/}
            {/*    <Typography component="a" href="/feedback" className={classes.typographyButton} style={{ marginLeft: 4 }}>Отправить</Typography>*/}
            {/*    <Typography className={classes.typography}>подписанные документы и ваши сканы через форму обратной связи в CRM с пометкой «Регистрация»</Typography>*/}
            {/*</Typography>*/}

        </Box>
    )
};

const TooltipComponent = () => {
    return (
        <Box>
            <Typography>— Паспорт (первый разворот + регистрация)</Typography>
            <Typography>— Справка о постановке на учет ФЛ в качестве налогоплательщика НПД</Typography>
            <Typography>— Свидетельство о государственной регистрации физического лица в качестве индивидуального предпринимателя (ОГРНИП) или лист записи ЕГРН</Typography>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#ED8E00'
    },
    rootWarning: {
        backgroundColor: '#ED8E00'
    },
    rootSuccess: {},

    typography: {
        display: 'flex',
        alignItems: 'center',

        fontSize: 16,
        lineHeight: '26px',
        color: 'white',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
    },
    typographyClosed: {
        position: 'relative',

        "&::after": {
            content: "''",
            width: '100%',
            height: 1,
            top: '50%',
            backgroundColor: 'white',
            position: 'absolute',
            left: 0
        }
    },
    typographyBold: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: '26px',
        color: 'white',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },
    typographyLink: {
        color: 'white',
        fontWeight: '500',
        textDecoration: 'underline'
    },
    typographyButton: {
        cursor: 'pointer',

        fontSize: 16,
        lineHeight: '16px',
        color: '#ED8E00',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        padding: '6px 8px',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        marginRight: 4,

        '&:hover': {
            boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
            backgroundColor: "#8152E4",
            color: "white"
        }
    }
}));

export default compose(
    connect(
        state => ({
            organization: state.app.organization
        })
    ),
)(StagesDocumentVerification);
