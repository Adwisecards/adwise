import React from "react";
import {
    Box,
    Grid,
    Typography,

} from "@material-ui/core";
import {
    Table
} from "./components";

import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class OrganizationEmployees extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            employees: [],

            isLoading: true
        };

        this.organization = props.app.organization;
    }

    componentDidMount = () => {
        this.getListEmployees();
    }

    getListEmployees = () => {
        this.setState({ isLoading: true });

        axiosInstance.get(`${ urls["get-employees"] }${ this.organization._id }?all=1`).then((response) => {
           const { employees } = response.data.data;

           this.setState({
               employees,
               isLoading: false
           })
        });
    }

    onChangeDisabled = (employee) => {
        axiosInstance.put(`${ urls["set-employee-disabled"] }${ employee._id }`, {
            disabled: !employee.disabled
        }).then((response) => {
            let employees = [...this.state.employees];
            let employeeNew = employees.find((t) => t._id === employee._id);
            employeeNew.disabled = !employeeNew.disabled;

            this.setState({
                employees: employees
            });
        }).catch((error) => {

        });
    }

    render() {
        const { employees, isLoading } = this.state;

        return (
            <>

                <Box mb={2}>
                    <Typography variant="h1">{allTranslations(localization.employeesTitle)}</Typography>
                </Box>

                <Table
                    rows={employees}
                    isLoading={isLoading}

                    onChangeDisabled={this.onChangeDisabled}
                />

            </>
        )
    }
}

export default OrganizationEmployees
