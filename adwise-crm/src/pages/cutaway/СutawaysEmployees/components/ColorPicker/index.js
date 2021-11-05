import React, {PureComponent} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,

    Typography,
    Button,
    Box,
    Grid
} from "@material-ui/core";
import {SketchPicker} from 'react-color';
import {CutawayWork} from "../../../../../components";
import PersonPhoto from "../../../../../assets/images/organization-clients/foto1.png";
import {compose} from "recompose";
import {connect} from "react-redux";

class ColorPickerComponent extends PureComponent {
    constructor(props) {
        super(props);

        const organization = props?.app?.organization || {};

        this.state = {
            color: props.color,

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
                }
            }
        }
    }

    onChangeColor = () => {
        this.props.onChange(this.state.color)
    }

    render() {
        const {color, cutaway} = this.state;
        const {isOpen, onClose} = this.props;

        return (
            <Dialog
                open={isOpen}
                maxWidth="sm"
                fullWidth

                onClose={onClose}
            >

                <DialogTitle>
                    <Typography variant="h3">Изменение цвета визиток</Typography>
                </DialogTitle>

                <DialogContent>
                    <Box pb={3}>
                        <Grid container spacing={3} direction="column" alignItems="center">
                            <Grid item>
                                <CutawayWork
                                    colorCard={color}
                                    person={cutaway.person}
                                    company={cutaway.company}
                                    showBackSide={false}
                                />
                            </Grid>
                            <Grid item>
                                <SketchPicker
                                    name='color'
                                    color={color}
                                    onChangeComplete={color => this.setState({color: color.hex})}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Box px={2} pb={1} width="100%">
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button size="small" variant="contained" onClick={this.onChangeColor}>Изменить</Button>
                            </Grid>
                            <Grid item>
                                <Button size="small" variant="outlined" onClick={onClose}>Закрыть</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogActions>

            </Dialog>
        )
    }
}

export default compose(
    connect(
        state => ({
            app: state.app
        }),
        dispatch => ({}),
    ),
)(ColorPickerComponent);
