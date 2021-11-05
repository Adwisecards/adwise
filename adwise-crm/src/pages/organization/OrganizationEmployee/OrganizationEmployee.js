import React, {Component} from 'react';
import {
    Box,
    Tabs,
    Tab
} from "@material-ui/core";
import {
    User as UserComponent,
    CommonInformations as CommonInformationsComponent,
    TablePurchases as TablePurchasesComponent,
    TableRatings as TableRatingsComponent
} from "./components";
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import alertNotification from "../../../common/alertNotification";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class OrganizationEmployee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ratings: [],
            purchases: [],

            employee: {},
            contact: {},

            activeTab: "purchases",

            isLoading: true
        }

        this.employeeId = props?.match?.params?.id;
    }

    componentDidMount = async () => {
        await this.getCashier();
    }

    getCashier = async () => {

        const employee = await axiosInstance.get(`${ urls["employee-get"] }/${ this.employeeId }`).then((response) => {
            return response.data.data.employee
        }).catch((error) => {
           return null
        });
        const contact = await axiosInstance.get(`${ urls["get-contact"] }${ employee?.contact }`).then((res) => {
            return res.data.data.contact
        }).catch((error) => {
            return null
        })
        const ratings = await axiosInstance.get(`${ urls["employee-ratings"] }/${ this.employeeId }`).then((response) => {
            return response.data.data.employeeRatings
        }).catch((error) => {
            return null
        });
        const purchases = await axiosInstance.get(`${ urls["get-purchases"] }${ employee?.organization }?limit=999&cashierContactId=${ employee?.contact }`).then((response) => {
            return response.data.data.purchases
        }).catch((error) => {
            return []
        });

        if (!employee) {
            alertNotification({
                title: allTranslations(localization.notificationSystemNotification),
                type: "error",
                message: "Кассир не найден"
            })

            return null
        }

        this.setState({
            employee,
            ratings,
            purchases,
            contact,
            isLoading: false
        });
    }

    render() {
        const {
            ratings,
            purchases,

            employee,
            contact,

            activeTab,

            isLoading
        } = this.state;

        return (
            <>

                <UserComponent
                    contact={contact}
                    isLoading={isLoading}
                />

                <CommonInformationsComponent
                    employee={employee}
                    contact={contact}
                />

                <Box mb={2}>

                    <Tabs value={activeTab} onChange={(event, activeTab) => this.setState({activeTab})}>
                        <Tab label={allTranslations(localization['employee.tabs.purchases'])} value="purchases"/>
                        <Tab label={allTranslations(localization['employee.tabs.ratings'])} value="ratings"/>
                    </Tabs>

                </Box>

                <Box>

                    {

                        Boolean(activeTab === 'purchases') && (
                            <TablePurchasesComponent
                                rows={purchases}
                                isLoading={isLoading}
                            />
                        )

                    }

                    {

                        Boolean( activeTab === 'ratings' ) && (
                            <TableRatingsComponent
                                rows={ratings}
                            />
                        )

                    }

                </Box>

            </>
        );
    }
}

export default OrganizationEmployee
