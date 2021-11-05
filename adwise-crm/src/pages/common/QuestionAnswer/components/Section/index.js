import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Button,

    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@material-ui/core";
import {
    makeStyles
} from "@material-ui/styles";
import {
    ChevronDown as ChevronDownIcon,
    ChevronUp as ChevronUpIcon,
} from "react-feather";

const Section = (props) => {
    const { title, items } = props;
    const classes = useStyles();

    return (
        <Box mb={6}>

            <Box mb={2}>
                <Typography variant="h4">{ title }</Typography>
            </Box>

            <Grid container spacing={2}>
                {
                    (items || []).map((item, idx) => (
                        <>
                            <Grid item xs={12}>
                                <AccordionItem {...item}/>
                            </Grid>
                            {
                                Boolean(items.length > idx + 1) && (
                                    <Grid item xs={12}>
                                        <div className={classes.separator}/>
                                    </Grid>
                                )
                            }
                        </>
                    ))
                }
            </Grid>

        </Box>
    )
};

const AccordionItem = (item) => {
    const [ isOpen, setOpen ] = useState(false);

    const classes = useStyles();
    const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;

    return (
        <Accordion
            expanded={isOpen}
            square
            classes={{
                root: classes.accordion
            }}
            onChange={() => setOpen(!isOpen)}
        >
            <AccordionSummary
                classes={{
                    root: classes.accordionSummary,
                    content: classes.accordionSummary
                }}
            >
                <Grid container justify="space-between" alignItems="center" wrap="nowrap">
                    <Grid item>
                        <Typography className={classes.accordionTitle} dangerouslySetInnerHTML={{__html: item.question}}/>
                    </Grid>
                    <Grid item>
                        <Icon color="#8152E4"/>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails
                classes={{
                    root: classes.accordionSummary,
                    content: classes.accordionSummary
                }}
            >
                <Typography className={classes.accordionMessage} dangerouslySetInnerHTML={{__html: item.answer}}/>
            </AccordionDetails>
        </Accordion>
    )
}

const useStyles = makeStyles(() => ({
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#000000',
        opacity: 0.1
    },

    accordion: {
        minHeight: 'auto!important',
        padding: 0,
        boxShadow: "none"
    },
    accordionSummary: {
        minHeight: 'auto!important',
        margin: '0!important',
        padding: 0
    },
    accordionDetails: {},
    accordionTitle: {
        fontSize: 16,
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        opacity: 0.5,
        marginBottom: '-1em'
    },
    accordionMessage: {
        fontSize: 14,
        lineHeight: '17px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",

        marginTop: 8
    },
}));

export default Section
