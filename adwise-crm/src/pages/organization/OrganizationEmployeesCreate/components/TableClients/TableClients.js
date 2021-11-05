import React from "react";
import {
    Box,
    Grid,

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,

    Checkbox,
    Radio,

    Avatar,

    Select,
    MenuItem,

    Typography
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import PerfectScrollbar from "react-perfect-scrollbar";
import {Pagination, Skeleton} from "@material-ui/lab";
import * as Yup from "yup";
import {Formik} from "formik";
import {PlugsOrganizationDefaultUser as PlugsOrganizationDefaultUserIcon} from "../../../../../icons/plugs";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const roles = [
    {
        title: allTranslations(localization.employeesCreateListCashier),
        value: 'cashier'
    },
    {
        title: allTranslations(localization.employeesCreateListManager),
        value: 'manager'
    },
];

const TableLoaderRow = () => {
    return (
        <>
            {
                [0, 1, 2, 3, 4, 5, 6].map((item) => (
                    <TableRow key={`loader-table-${item}`}>
                        <TableCell align={'left'} width={30}>
                            <Skeleton variant={"circle"} height={22} width={22}/>
                        </TableCell>
                        <TableCell align={'left'} width={60}>
                            <Skeleton variant={"circle"} height={40} width={40}/>
                        </TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                        <TableCell align={'left'}><Skeleton height={35}/></TableCell>
                    </TableRow>
                ))
            }
        </>
    )
}

const TableClients = (props) => {
    const {filter, pagination, isLoad, clientsList, onChangeListClients, onChangeFilter} = props;
    const classes = useStyles();

    const handleChangeCheckRow = (client) => {
        client.checked = Boolean(!client.checked);

        onChangeListClients(clientsList)
    }
    const handleChangeUserRole = (event, value, client) => {
        const userRole = value.props.value;

        client.role = userRole;

        onChangeListClients(clientsList)
    }
    const handleOnChangeFilter = (event, page) => {
        let newFiler = {...filter};
        newFiler.page = page;
        onChangeFilter(newFiler, true)
    }

    if (!isLoad && clientsList.length <= 0){
        return (
            <Box>
                <Typography variant="h4">{allTranslations(localization.employeesCreateSuccessNotClients)}</Typography>
            </Box>
        )
    }

    return (
        <Formik
            initialValues={clientsList}
        >
            {({
                  errors,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values
              }) => {
                return (
                    <>

                        <Box mb={2}>
                            <PerfectScrollbar>
                                <Box minWidth={1000}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align={'left'} width={30}></TableCell>
                                                <TableCell align={'left'} width={60}></TableCell>
                                                <TableCell align={'left'}>{allTranslations(localization.employeesCreateTableHeaderName)}</TableCell>
                                                <TableCell align={'left'}>{allTranslations(localization.employeesCreateTableHeaderPhone)}</TableCell>
                                                <TableCell align={'left'}>{allTranslations(localization.employeesCreateTableHeaderEmail)}</TableCell>
                                                <TableCell align={'left'} width={300}>{allTranslations(localization.employeesCreateTableHeaderRole)}</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>

                                            {(isLoad) && <TableLoaderRow/>}

                                            {!isLoad && (
                                                <>
                                                    {
                                                        clientsList.map((client, idx) => {
                                                            const isChecked = client.checked;
                                                            const role = client.role ? client.role : 'cashier';

                                                            return (
                                                                <TableRow
                                                                    selected={isChecked}
                                                                >
                                                                    <TableCell align={'left'}>
                                                                        <Checkbox
                                                                            color="primary"
                                                                            checked={isChecked}
                                                                            onChange={() => handleChangeCheckRow(client)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align={'left'}>
                                                                        {
                                                                            (client.contact.picture && client.contact.picture.value) ? (
                                                                                <img src={ client.contact.picture.value } style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '100%' }}/>
                                                                            ) : (
                                                                                <PlugsOrganizationDefaultUserIcon style={{ width: 40, height: 40 }}/>
                                                                            )
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell align={'left'}>
                                                                        <div>{client.contact.firstName.value}</div>
                                                                        <div>{client.contact.lastName.value}</div>
                                                                    </TableCell>
                                                                    <TableCell align={'left'}>{client.contact.phone.value}</TableCell>
                                                                    <TableCell align={'left'}>{client.contact.email.value}</TableCell>
                                                                    <TableCell align={'left'}>
                                                                        {
                                                                            (!!isChecked) && (
                                                                                <Select
                                                                                    variant={'outlined'}
                                                                                    value={role}
                                                                                    className={classes.select}
                                                                                    fullWidth

                                                                                    onChange={(event, value) => handleChangeUserRole(event, value, client)}
                                                                                >
                                                                                    {
                                                                                        roles.map((item, idx) => (
                                                                                            <MenuItem
                                                                                                value={item.value}>{item.title}</MenuItem>
                                                                                        ))
                                                                                    }
                                                                                </Select>
                                                                            )
                                                                        }
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    }
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </PerfectScrollbar>
                        </Box>

                        <Box>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Pagination
                                        page={filter.page}
                                        count={pagination.pages}

                                        onChange={handleOnChangeFilter}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                    </>
                )
            }}
        </Formik>
    )
}

const useStyles = makeStyles((theme) => ({
    select: {
        '& .MuiSelect-outlined.MuiSelect-outlined': {
            backgroundColor: 'transparent'
        }
    }
}));

export default TableClients
