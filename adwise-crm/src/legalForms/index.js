import React, {useState, useEffect} from "react";
import {
    Box,

    Grid,

    Typography
} from "@material-ui/core";

import {
    ComponentInput,
    ComponentPhone,
    ComponentFile,
    ComponentDate,
    ComponentAddress
} from "./components";

import individual from './forms/individual';
import ip from './forms/ip';
import ooo from './forms/ooo';
import * as Yup from "yup";
import {Formik} from "formik";

const RenderForm = (props) => {
    const {setRef, info, data, organization, onChange, validationSheme} = props;

    const [sections, setSections] = useState([]);
    const [sectionKey, setSectionKey] = useState('');

    useEffect(() => {
        switch (data) {
            case 'individual': {
                setSections(individual);
                setSectionKey('individual');

                break
            }
            case 'ip': {
                setSections(ip);
                setSectionKey('ip');

                break
            }
            case 'ooo': {
                setSections(ooo);
                setSectionKey('ooo');

                break
            }
        }
    }, [data]);


    const handleChangeValidation = () => {
        if (!!validationSheme) {
            return validationSheme
        }

        let validationSchemaInit = {};

        sections.map((section) => {
            Object.keys(section.data).map((key) => {
                const item = section.data[key];

                if (!!item.validationSchema) {
                    validationSchemaInit[key] = item.validationSchema;
                }
            })
        });

        if (Object.keys(validationSchemaInit) <= 0) {
            return null
        }

        return Yup.object().shape(validationSchemaInit)
    }

    const handleOnChange = ({target}) => {
        const name = target.name;
        const value = target.value;

        let newInfo = {...info};

        newInfo[name] = value;

        onChange(newInfo);
    }
    const handleOnChangeFiles = ({target}) => {
        const {name, files} = target;

        let newInfo = {...info};

        newInfo[name] = files;

        onChange(newInfo)
    }

    const handleSubmit = () => {}

    const sheme = handleChangeValidation();

    if (!sheme) {
        return null
    }

    return (
        <Formik
            innerRef={setRef}
            initialValues={info}
            validationSchema={sheme}
            onSubmit={handleSubmit}
        >
            {(props) => {
                const { touched, errors, values } = props;

                return (
                    <Box>

                        <Grid container spacing={5}>
                            <Grid item xs={6}>

                                {

                                    sections.map((section, idx) => {
                                        if (idx % 2 === 1) {
                                            return null
                                        }

                                        return (
                                            <Grid container spacing={2} style={{marginBottom: 36}}>

                                                {

                                                    Object.keys(section.data).map((key, idx) => {
                                                        const element = section.data[key];

                                                        if (!element) {
                                                            return null
                                                        }

                                                        const value = values[key];

                                                        if (element.type === 'date') {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <ComponentDate
                                                                        value={value || '01.01.2000'}
                                                                        name={key}
                                                                        onChange={handleOnChange}
                                                                        error={Boolean(errors[key])}
                                                                        helperText={errors[key]}
                                                                        {...element}
                                                                    />
                                                                </Grid>
                                                            )
                                                        }
                                                        if (element.type === 'file') {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <ComponentFile
                                                                        value={value}
                                                                        name={key}
                                                                        onChange={handleOnChangeFiles}
                                                                        {...element}
                                                                        error={Boolean(errors[key])}
                                                                        helperText={errors[key]}
                                                                    />
                                                                </Grid>
                                                            )
                                                        }
                                                        if (element.type === 'address') {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <ComponentAddress
                                                                        value={value || ''}
                                                                        name={key}
                                                                        onChange={handleOnChange}
                                                                        {...element}
                                                                        error={Boolean(errors[key])}
                                                                        helperText={errors[key]}
                                                                    />
                                                                </Grid>
                                                            )
                                                        }

                                                        return (
                                                            <Grid item xs={12}>
                                                                <ComponentInput
                                                                    value={value || ''}
                                                                    name={key}
                                                                    onChange={handleOnChange}
                                                                    {...element}
                                                                    error={Boolean(errors[key])}
                                                                    helperText={errors[key]}
                                                                />
                                                            </Grid>
                                                        )
                                                    })

                                                }
                                            </Grid>
                                        )

                                    })

                                }

                            </Grid>
                            <Grid item xs={6}>

                                {

                                    sections.map((section, idx) => {
                                        if (idx % 2 === 0) {
                                            return null
                                        }

                                        return (
                                            <Grid container spacing={2} style={{marginBottom: 36}}>

                                                {

                                                    Object.keys(section.data).map((key, idx) => {
                                                        const element = section.data[key];

                                                        if (!element) {
                                                            return null
                                                        }

                                                        const value = values[key];

                                                        if (element.type === 'date') {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <ComponentDate
                                                                        value={value || '01.01.2000'}
                                                                        name={key}
                                                                        onChange={handleOnChange}
                                                                        {...element}
                                                                        error={Boolean(errors[key])}
                                                                        helperText={errors[key]}
                                                                    />
                                                                </Grid>
                                                            )
                                                        }
                                                        if (element.type === 'file') {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <ComponentFile
                                                                        value={value}
                                                                        name={key}
                                                                        onChange={handleOnChangeFiles}
                                                                        {...element}
                                                                        error={Boolean(errors[key])}
                                                                        helperText={errors[key]}
                                                                    />
                                                                </Grid>
                                                            )
                                                        }
                                                        if (element.type === 'address') {
                                                            return (
                                                                <Grid item xs={12}>
                                                                    <ComponentAddress
                                                                        value={value || ''}
                                                                        name={key}
                                                                        onChange={handleOnChange}
                                                                        {...element}
                                                                        error={Boolean(errors[key])}
                                                                        helperText={errors[key]}
                                                                    />
                                                                </Grid>
                                                            )
                                                        }

                                                        return (
                                                            <Grid item xs={12}>
                                                                <ComponentInput
                                                                    value={value || ''}
                                                                    name={key}
                                                                    onChange={handleOnChange}
                                                                    {...element}
                                                                    error={Boolean(errors[key])}
                                                                    helperText={errors[key]}
                                                                />
                                                            </Grid>
                                                        )
                                                    })

                                                }

                                            </Grid>
                                        )
                                    })

                                }

                            </Grid>
                        </Grid>

                    </Box>
                )
            }}
        </Formik>
    )

}

export default RenderForm
