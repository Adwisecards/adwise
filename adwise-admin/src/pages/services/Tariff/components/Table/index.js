import React from "react";
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
    IconButton,
    Switch,
    Tooltip
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
    makeStyles
} from "@material-ui/styles";
import {
    Check as CheckIcon,
    Edit2 as Edit2Icon,
    Minus as MinusIcon
} from "react-feather";
import currency from "../../../../../constants/currency";

const TableOrganization = (props) => {
    const {rows, isLoading, onEdit, onDelete, onDisabledPacket} = props;

    const classes = useStyles();

    return (

        <>

            <Box>

                <Table>

                    <TableHeader/>

                    {
                        isLoading && (
                            <BodyLoaders/>
                        )
                    }

                    {
                        !isLoading && (
                            <TableBody>

                                {
                                    rows.map((row, idx) => {
                                        return (

                                            <TableRow key={`row-organization-${idx}`}>

                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.price} {currency[row.currency]}</TableCell>
                                                <TableCell>{row.limit}</TableCell>
                                                <TableCell>{row.managerReward}</TableCell>
                                                <TableCell>{row.refBonus}</TableCell>
                                                <TableCell align="center">
                                                    {row.wiseDefault && (
                                                        <Tooltip title="Стандартный пакет для Wise Win менеджера (устарело)">
                                                            <div className={classes.wiseDefault} style={{backgroundColor: '#94D36C'}}>
                                                                <CheckIcon color="white" size={20}/>
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {(row.wiseDefault === undefined) && (
                                                        <Tooltip title={Boolean(row.wisewinOption) ? 'Есть скидка для Wise Win пользователей' : 'Полная стоимость для всех'}>
                                                            <div className={classes.wiseDefault} style={{backgroundColor: Boolean(row.wisewinOption) ? '#94D36C' : '#FA7D7D'}}>
                                                                {
                                                                    Boolean(row.wisewinOption) ? (
                                                                        <CheckIcon color="white" size={20}/>
                                                                    ) : (
                                                                        <MinusIcon  color="white" size={20}/>
                                                                    )
                                                                }
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>

                                                <TableCell align="right">

                                                    <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                                        <Grid item>
                                                            <Tooltip title="Редактирование">
                                                                <IconButton onClick={() => onEdit(row)}>
                                                                    <Edit2Icon color="#8152E4"/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item>
                                                            <Tooltip title={row.disabled ? "Включить тариф" : "Выключить тариф"}>
                                                                <Switch checked={!row.disabled} color="primary" onChange={() => onDisabledPacket(row)}/>
                                                            </Tooltip>
                                                        </Grid>

                                                    </Grid>

                                                </TableCell>

                                            </TableRow>

                                        )
                                    })
                                }

                            </TableBody>
                        )
                    }

                </Table>

            </Box>

        </>

    )
}

const TableHeader = () => {
    return (
        <TableHead>

            <TableCell>Тариф</TableCell>
            <TableCell>Цена</TableCell>
            <TableCell>Лимит</TableCell>
            <TableCell>Награда м.</TableCell>
            <TableCell>Награда реф.</TableCell>
            <TableCell>Wise Default (устарело)</TableCell>
            <TableCell>Льгота для Wise Win</TableCell>
            <TableCell></TableCell>

        </TableHead>
    )
}
const BodyLoaders = () => {
    const rows = [1, 1, 1, 1, 1, 1];

    return (
        <TableBody>

            {
                rows.map((row) => (

                    <TableRow>

                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>
                        <TableCell><Skeleton height={30}/></TableCell>

                        <TableCell align="right">
                            <Grid container spacing={2} wrap="nowrap" justify="flex-end">

                                <Grid item><Skeleton height={30} width={30} variant="circle"/></Grid>

                            </Grid>
                        </TableCell>

                    </TableRow>

                ))
            }

        </TableBody>
    )
}

const useStyles = makeStyles((theme) => ({
    stickyActionsColumn: {
        '& table:first-child': {
            '& tr': {
                '& td:last-child, th:last-child': {
                    backgroundColor: '#f9f9fa',
                    position: 'sticky',
                    right: 0,
                    zIndex: 0,

                    '&::before': {
                        content: "''",
                        width: 5,
                        height: 'calc(100% + 1px)',

                        position: 'absolute',

                        right: '100%',
                        top: -8,
                        zIndex: -1,

                        background: 'linear-gradient(90deg, rgba(248,108,108,0) 0%, rgba(129, 82, 228, .3) 100%)',

                        transition: 'all 1s'
                    },
                    '&::after': {
                        content: "''",
                        width: '100%',

                        position: 'absolute',

                        left: 0,
                        // top: -8,
                        zIndex: -1,

                        backgroundColor: '#f9f9fa'
                    },
                },
                '& th:first-child': {
                    zIndex: 1
                }
            },
            '& tr:nth-child(2n)': {
                '& td:last-child, th:last-child': {
                    backgroundColor: 'white',
                    position: 'sticky',
                    right: 0,
                    zIndex: 0,
                    '&::after': {
                        content: "''",
                        width: '100%',

                        position: 'absolute',

                        left: 0,
                        top: -8,
                        zIndex: -1,

                        backgroundColor: 'white'
                    },
                },
                '& th:first-child': {
                    zIndex: 1
                }
            },
            '& th': {
                backgroundColor: 'white',
                position: 'sticky',
                right: 0,
                zIndex: 1
            },
        }
    },
    stickyActionsShadow: {
        '& table:first-child': {
            '& tr': {
                '& td:last-child, th:last-child': {
                    '&::before': {
                        background: 'transparent'
                    }
                }
            }
        }
    },

    wiseDefault: {
        width: 30,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 999
    }
}));

export default TableOrganization
