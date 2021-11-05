import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {withStyles} from '@material-ui/styles';

import {СutawayContent, ColorPicker} from './components'

import Group from '../../../assets/images/CutawayWork/Group_1404.png'
import PersonPhoto from '../../../assets/images/organization-clients/foto1.png'
import axiosInstance from "../../../agent/agent";
import urls from "../../../constants/urls";
import {Backdrop, CircularProgress} from "@material-ui/core";

class СutawaysEmployees extends Component {
    constructor(props) {
        super(props);

        const organization = props?.app?.organization || {};

        this.state = {
            cutaway: {
                person: {
                    personName: 'Сергей Петров',
                    position: 'Менеджер',
                    phone: '7 987 765-32-10',
                    email: 'info@adwise.card',
                    image: PersonPhoto,
                    social: [
                        {
                            type: 'instagram',
                        },
                        {
                            type: 'youtube',
                        },
                        {
                            type: 'facebook',
                        }
                    ]
                },
                company: {
                    companyName: organization?.name || '',
                    color: organization?.colors?.primary,
                    logo: organization?.picture,
                    opacity: 0.1,
                },
                showBackSide: true,

            },
            employees: [],
            employeesChange: [],

            employeesColors: {},
            userChange: {},

            initColorColorPicker: "",

            isLoading: false,
            isError: false,
            isOpenColorPicker: false,
            isShowBackdrop: false,
            isOpenColorPickerUser: false,
        }

        this.organizationId = this.props.app.organization._id;
    }

    componentDidMount = async () => {
        await this.onLoadList();
    }

    onLoadList = async () => {
        const employees = await axiosInstance.get(`${urls["get-employees"]}${this.organizationId}?page=1&limit=20`).then((response) => {
            return response.data.data.employees
        }).catch((error) => {
            return null
        })

        if (!employees) {
            return null
        }

        let employeesColors = {};

        employees.map((employee) => {
            const color = employee.contact.color;

            if (!employeesColors[color]) {
                employeesColors[color] = {
                    color: color,
                    employees: []
                }
            }
            ;

            employeesColors[color]['employees'] = [...employeesColors[color]['employees'], employee]
        });

        this.setState({
            employeesColors,
            isShowBackdrop: false,
            isOpenColorPicker: false,
            isOpenColorPickerUser: false,
        })
    }

    goToCreate = () => {
        this.props.history.push('/cutaways/create');
    }

    onChangeColor = async (employees = this.state.employeesChange, color) => {
        if (!color) {
            this.setState({
                isOpenColorPicker: true,
                employeesChange: employees,
                initColorColorPicker: employees?.list[0]?.contact?.color
            })

            return null
        }

        this.setState({ isShowBackdrop: true });

        const employeesIds = employees.list.map((employ) => {
            return employ.contact._id
        });

        await Promise.all(employeesIds.map(async (id) => {
            await axiosInstance.put(`${urls["update-contact"]}${id}`, {color: color});
        }));

        this.onLoadList();
    }
    onChangeColorUser = async (user = this.state.userChange, color) => {
        if (!color) {
            this.setState({
                isOpenColorPickerUser: true,
                userChange: user,
                initColorColorPicker: user?.contact?.color
            })

            return null
        }

        this.setState({ isShowBackdrop: true });
        await axiosInstance.put(`${urls["update-contact"]}${user?.contact?._id}`, {color: color});
        this.onLoadList();
    }

    render() {
        const {classes} = this.props
        const {isLoading, cutaway, employees, employeesColors, isOpenColorPickerUser} = this.state;

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h1" component="h1" className={classes.title}>
                        Визитки сотрудников
                    </Typography>
                </Grid>
                <Grid container spacing={3} item xs={7}>
                    {
                        Object.keys(employeesColors).map((key, idx) => {
                            const employeesColor = employeesColors[key];

                            return (
                                <Grid container className={classes.cutawayContent}>
                                    <СutawayContent
                                        key={`employees-color-${idx}`}

                                        isLoading={isLoading}
                                        color={employeesColor.color}
                                        cutaway={cutaway}
                                        employees={employeesColor.employees}

                                        onChangeColor={this.onChangeColor}
                                        onChangeColorUser={this.onChangeColorUser}
                                    />
                                </Grid>
                            )
                        })
                    }
                </Grid>

                <ColorPicker
                    isOpen={this.state.isOpenColorPicker}

                    color={this.state.initColorColorPicker}

                    onClose={() => this.setState({isOpenColorPicker: false})}
                    onChange={(color) => this.onChangeColor(undefined, color)}
                />

                <ColorPicker
                    isOpen={this.state.isOpenColorPickerUser}

                    color={this.state.initColorColorPicker}

                    onClose={() => this.setState({isOpenColorPickerUser: false})}
                    onChange={(color) => this.onChangeColorUser(undefined, color)}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>
            </Grid>
        );
    }
}

const styles = {
    title: {
        marginBottom: '32px'
    },
    cutawayContent: {
        border: '0.5px solid rgba(168, 171, 184, 0.6)',
        borderRadius: '5px',
        maxWidth: '900px',
        marginTop: '32px',
        padding: '26px 30px'
    }
};


export default withStyles(styles)(СutawaysEmployees)
