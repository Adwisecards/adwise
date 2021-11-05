import React from "react";
import {
    Box,
    Grid,
    Avatar,
    Button,
    IconButton,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    PlusCircle as PlusCircleIcon,
    X as XIcon
} from "react-feather";
import {formatMoney} from "../../../../../helper/format";
import currency from "../../../../../constants/currency";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const UsersSelected = (props) => {
    const { selected, onChange, onOpenSelected } = props;
    const classes = useStyles();

    const handleOnChange = (user) => {
        let newSelected = [...selected];
        let index = newSelected.findIndex((t) => t._id === user._id);

        newSelected.splice(index, 1);

        onChange(newSelected);
    }

    return (
        <>

            <Box mb={3}>
                <Typography className={classes.title}>{allTranslations(localization['bill_create.usersSelected.title'])}</Typography>
            </Box>

            <Box mb={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{allTranslations(localization['bill_create.usersSelected.table.client'])}</TableCell>
                            <TableCell>{allTranslations(localization['bill_create.usersSelected.table.purchase_count'])}</TableCell>
                            <TableCell align="right">{allTranslations(localization['bill_create.usersSelected.table.cashback'])}</TableCell>
                            <TableCell align="right">{allTranslations(localization['bill_create.usersSelected.table.purchase_sum'])}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            selected.map((client, idx) => (
                                <TableRow>
                                    <TableCell>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item>
                                                <Avatar
                                                    src={client?.contact?.picture?.value || '/img/user_empty.png'}
                                                />
                                            </Grid>
                                            <Grid item>
                                                {`${client?.contact?.firstName?.value} ${client?.contact?.lastName?.value}`}
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        { formatMoney(client?.stats?.purchaseCount || 0, 0, '') }
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatMoney(client?.stats?.cashbackSum || 0, 0, '')} {currency.rub}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatMoney(client?.stats?.purchaseSum || 0, 0, '')} {currency.rub}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton>
                                            <XIcon color="#8152E4" onClick={() => handleOnChange(client)}/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Box>

            <Box>
                <Button variant="text" onClick={onOpenSelected}>
                    <PlusCircleIcon color="#8152E4" size={20} style={{marginRight: 8}}/>

                    {allTranslations(localization['bill_create.usersSelected.add_client'])}
                </Button>
            </Box>

        </>
    )
}

const useStyles = makeStyles(() => ({
    title: {
        fontSize: 20,
        lineHeight: '24px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: "#25233E"
    },

    total: {
        marginRight: 24,

        fontSize: 18,
        lineHeight: '56px',
        color: '#25233E',
        fontWeight: '500',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        textAlign: "right"
    },

    productImage: {
        width: 50,
        height: 50,
        border: "0.5px solid rgba(168, 171, 184, 0.6)",
        borderRadius: 5,
        backgroundColor: '#E9E9E9',

        marginRight: 16
    }
}));

export default UsersSelected
