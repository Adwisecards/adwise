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
    ComponentDate
} from "./components";

import individual from './forms/individual';
import ip from './forms/ip';
import ooo from './forms/ooo';
import individualOld from './formsOld/individual';
import ipOld from './formsOld/ip';
import oooOld from './formsOld/ooo';

const RenderForm = (props) => {
    const {info, data, onChange} = props;

    const [sections, setSections] = useState([]);
    const [isNewForm, setNewForm] = useState(true);

    useEffect(() => {
        if (info?.bankAccount?.bik){
            handleSetNewForm(data)
        } else {
            handleSetOldForm(data)
        }
    }, [data]);

    const handleSetOldForm = (data) => {
        setNewForm(false);

        switch (data) {
            case 'individual': {
                setSections(individualOld);

                break
            }
            case 'ip': {
                setSections(ipOld);

                break
            }
            case 'ooo': {
                setSections(oooOld);

                break
            }
        }
    }
    const handleSetNewForm = (data) => {
        setNewForm(true);
        switch (data) {
            case 'individual': {
                setSections(individual);

                break
            }
            case 'ip': {
                setSections(ip);

                break
            }
            case 'ooo': {
                setSections(ooo);

                break
            }
        }
    }

    const handleOnChange = ({target}) => {
        const name = target.name;
        const value = target.value;

        let newInfo = {...info};

        newInfo[name] = value;

        onChange(newInfo)
    }
    const handleOnChangeFiles = ({target}) => {
        const { name, files } = target;

        let newInfo = {...info};

        newInfo[name] = files;

        onChange(newInfo)
    }

    console.log('sections: ', sections);

    return (
        <Box>

            <Box>
                {
                    sections.map((form, idx) => {
                        return (
                            <Box>
                                <Grid container spacing={4}>
                                    <Grid item xs={6}>
                                        {
                                            (form?.sections || []).map((section, idx) => {
                                                if (idx % 2 === 1) {
                                                    return null
                                                }

                                                return (
                                                    <Box mb={9}>
                                                        {
                                                            Boolean(!!section.title) && (
                                                                <Box mb={4}>
                                                                    <Typography
                                                                        variant="h3">{section.title}</Typography>
                                                                </Box>
                                                            )
                                                        }
                                                        {
                                                            (section?.items || []).map((element, idx) => {
                                                                if (element.type === 'date') {
                                                                    return (
                                                                        <Box mb={4}>
                                                                            <ComponentDate
                                                                                value={info[element.name]}
                                                                                {...element}
                                                                            />
                                                                        </Box>
                                                                    )
                                                                }
                                                                return (
                                                                    <Box mb={4}>
                                                                        <ComponentInput
                                                                            value={info[element.name]}
                                                                            {...element}
                                                                        />
                                                                    </Box>
                                                                )
                                                            })
                                                        }
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Grid>
                                    <Grid item xs={6}>
                                        {
                                            (form?.sections || []).map((section, idx) => {
                                                if (idx % 2 === 0) {
                                                    return null
                                                }

                                                return (
                                                    <Box mb={9}>
                                                        {
                                                            Boolean(!!section.title) && (
                                                                <Box mb={4}>
                                                                    <Typography
                                                                        variant="h3">{section.title}</Typography>
                                                                </Box>
                                                            )
                                                        }
                                                        {
                                                            (section?.items || []).map((element, idx) => {
                                                                if (element.type === 'date') {
                                                                    return (
                                                                        <Box mb={4}>
                                                                            <ComponentDate
                                                                                value={info[element.name]}
                                                                                {...element}
                                                                            />
                                                                        </Box>
                                                                    )
                                                                }
                                                                return (
                                                                    <Box mb={4}>
                                                                        <ComponentInput
                                                                            value={info[element.name]}
                                                                            {...element}
                                                                        />
                                                                    </Box>
                                                                )
                                                            })
                                                        }
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    })
                }
            </Box>

        </Box>
    )

}

export default RenderForm
