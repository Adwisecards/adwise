import React, {useState} from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,

    Box,
    Grid,
    Typography,
    IconButton,
    Link,
    Paper,
    Collapse,
} from "@material-ui/core";
import {
    Pagination,
    Skeleton
} from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    HelpBadge, TextFieldButtonClear
} from "../../../../../components";
import {
    ChevronUp as ChevronUpIcon,
    ChevronDown as ChevronDownIcon
} from "react-feather";
import loggingEvents from "../../../../../constants/loggingEvents";
import clsx from "clsx";
import moment from "moment";

const platforms = {
    "android": "Android",
    "ios": "IOS",
    "pc": "Компьютер",
};
const apps = {
    crm: "CRM",
    web: "WEB",
    cards: "AdWise Cards",
    business: "AdWise Business",
};
const messageKeys = {
    contactId: "ID визитной карточки",
    cutawayId: "ID визитной карточки",
    userId: "ID визитной карточки",

    companyId: "ID организации",
    organizationId: "ID организации",

    couponId: "ID купона",
    invitationId: "ID приглашения",
    date: "Дата",
    url: "Ссылка вхождения",
    usedPoints: "Использование баллов",
    purchase: "ID покупки"
};

const TableLogging = (props) => {
    const {
        rows,
        filter,
        pagination,
        isLoading,
        onChangeFilter
    } = props;

    const handleChangePage = (event, page) => {
        let newFilter = {...filter};
        newFilter.pageNumber = page;

        onChangeFilter(newFilter, true);
    }

    return (
        <>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mt={1} mb={3}>
                <Table>
                    <TableHeader/>

                    <TableBodyContent {...props}/>
                </Table>
            </Box>

            <Box>
                <Grid container justify="flex-end">
                    <Grid item>
                        <Pagination
                            page={filter.pageNumber}
                            count={pagination.countPages}

                            onChange={handleChangePage}
                        />
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

const TableHeader = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell>Событие</TableCell>
                <TableCell>Параметры</TableCell>
                <TableCell>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            Система
                        </Grid>
                        <Grid item>
                            <HelpBadge
                                titleTooltip="Платфома события могут быть: CRM, WEB, AdWise Cards, AdWise Business"/>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item>
                            Статус
                        </Grid>
                        <Grid item>
                            <HelpBadge
                                titleTooltip="Статус показывает тип логирование, он может быть как Ошибка так и Успешно"/>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell align="right">Дата создания</TableCell>
            </TableRow>
        </TableHead>
    )
}
const TableBodyContent = (props) => {
    const {rows, isLoading} = props;

    if (isLoading) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell><Skeleton height={30}/></TableCell>
                    <TableCell><Skeleton height={30}/></TableCell>
                    <TableCell><Skeleton height={30}/></TableCell>
                    <TableCell><Skeleton height={30}/></TableCell>
                    <TableCell><Skeleton height={30}/></TableCell>
                    <TableCell><Skeleton height={30}/></TableCell>
                    <TableCell align="right"><Skeleton height={30}/></TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
        <TableBody>
            {
                rows.map((row, idx) => {
                    return (
                        <ComponentTableRow {...row}/>
                    )
                })
            }
        </TableBody>
    )
}
const ComponentTableRow = (row) => {
    const [isOpen, setOpen] = useState(false);

    const classes = useStyles();

    const message = (!!row.message && row.message !== "{}") ? JSON.parse(row.message) : null;
    const isWarning = row.message.indexOf('/v1/finance/get-purchase/') > -1;
    const isUser = Boolean(row.user);

    const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;

    return (
        <>
            <TableRow style={isWarning ? {backgroundColor: 'rgba(237, 142, 0, 0.1)'} : {}}>
                <TableCell>
                    <IconButton onClick={() => setOpen(!isOpen)} disabled={!message}>
                        <Icon color={!message ? "#808080" : "#8152E4"}/>
                    </IconButton>
                </TableCell>
                <TableCell>{loggingEvents[row.event]}</TableCell>
                <TableCell>{platforms[row.platform]}</TableCell>
                <TableCell>{apps[row.app]}</TableCell>
                <TableCell align="center">
                    <Box className={clsx({
                        [classes.status]: true,
                        [classes.statusError]: row.isError,
                    })}/>
                </TableCell>
                <TableCell>
                    {
                        isUser ? (
                            <Link target="_blank"
                                  href={`/users?_id=${row.user._id}`}>{`${row.user?.firstName || ''} ${row.user?.lastName || ''}`}</Link>
                        ) : (
                            <Typography>Пользователь не определен</Typography>
                        )
                    }
                </TableCell>
                <TableCell align="right">
                    {moment(row.timestamp).format('DD.MM.YYYY')}<br/>
                    {moment(row.timestamp).format('HH:mm:ss')}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={7}>
                    <Collapse in={isOpen}>
                        <Paper elevation={0}>
                            <Box mt={1} mb={3}>
                                {
                                    !!message && (
                                        <Paper elevation={0}>
                                            {
                                                Object.keys(message).map(key => (
                                                    <ComponentMessage level={0} messageKey={key} message={message[key]}/>
                                                ))
                                            }
                                        </Paper>
                                    )
                                }
                            </Box>
                        </Paper>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

const ComponentMessage = (props) => {
    const {level, message, messageKey} = props;

    return (
        <Typography style={{ marginLeft: level * 8 }}>
            <span style={{fontWeight: '500'}}>{messageKeys[messageKey] || messageKey}:</span>
            {(typeof message === "object" && !!message) ? (
                Object.keys(message).map(key => (
                    <ComponentMessage level={level+1} messageKey={key} message={message[key]}/>
                ))
            ) : (
                <span>{message || ''}</span>
            )}
        </Typography>
    )
}

const useStyles = makeStyles(() => ({
    status: {
        width: 20,
        height: 20,
        borderRadius: 999,
        backgroundColor: '#94D36C',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    statusError: {
        backgroundColor: '#FA7D7D',
    },
}));

export default TableLogging
