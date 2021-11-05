import React, { useState } from 'react';
import {
    Box,

    Grid,

    Typography,

    Button,

    TextField, IconButton, FormHelperText
} from '@material-ui/core';
import {
    makeStyles
} from '@material-ui/styles';
import {
    Minus as MinusIcon,
    Plus as PlusIcon, PlusCircle as PlusCircleIcon
} from 'react-feather';
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";


const TagsMultiple = (props) => {
    const { organization, onChange } = props;
    const { tags } = organization;
    const [ newTag, setNewTag ] = useState('');
    const [ isShowNew, setIsShowNew ] = useState(false);

    const classes = useStyles();

    const handleRemoveTag = (idx) => {
        let newTags = [...tags];

        newTags.splice(idx, 1);

        onChange(newTags)
    }
    const handleAddTag = () => {
        if (!newTag){
            return null
        }

        let newTags = [...tags];
        newTags.push({
            _id: '',
            name: newTag
        });

        setNewTag('');
        setIsShowNew(false);
        onChange(newTags);
    }
    const handleChangeNewTag = (event) => {
        const target = event.target;
        const value = target.value;

        setNewTag(value);
    }

    const handleAddNew = () => {
        setIsShowNew(true)
    }
    const handleEventEnterForm = ({ charCode }) => {
        if(charCode === 13){
            handleAddTag()
        }
    }
    const handleChaneCurrentItem = ({ target }, idx) => {
        const value = target.value;

        if (!value){
            handleRemoveTag(idx);

            return null
        }

        let newTags = [...tags];
        newTags[idx] = { id: "", name: value };

        onChange(newTags)
    }

    const handleCloseAdd = () => {
        setNewTag('');
        setIsShowNew(false);
    }

    return (
        <>
            <Grid container justify={"space-between"} alignItems={"center"}>
                <Grid item><Typography variant="formTitle">{allTranslations(localization.organizationAboutFormsTags)}</Typography></Grid>
            </Grid>

            <Box mt={2}>
                {
                    tags.map((tag, idx) => (
                        <Grid key={`organization-tag-${ idx }`} container spacing={1} className={classes.root}>
                            <Grid item style={{ flex: 1 }}>
                                <label className={classes.tag}>
                                    <span className={classes.tagLattice}>#</span>
                                    <TextField
                                        value={tag.name}
                                        className={classes.input}

                                        placeholder={allTranslations(localization.organizationAboutPlaceholdersSaleFlowers)}

                                        onChange={(event) => handleChaneCurrentItem(event, idx)}
                                        onBlur={handleAddTag}
                                        fullWidth
                                    />
                                </label>
                            </Grid>

                            {
                                ( !isShowNew && idx === tags.length - 1 ) ? (
                                    <Grid item>
                                        <Button
                                            variant={"outlined"}
                                            className={classes.button}

                                            onClick={handleAddNew}
                                        >
                                            <PlusIcon color={'#8152E4'}/>
                                        </Button>
                                    </Grid>
                                ) : (
                                    <Grid item>
                                        <Button
                                            variant={"outlined"}
                                            className={classes.button}

                                            onClick={() => handleRemoveTag(idx)}
                                        >
                                            <MinusIcon color={'#8152E4'}/>
                                        </Button>
                                    </Grid>
                                )
                            }
                        </Grid>
                    ))
                }

                {
                    (isShowNew || tags.length <= 0) && (
                        <Grid container spacing={1} className={classes.root}>
                            <Grid item style={{ flex: 1 }}>
                                <label className={classes.tag}>
                                    <span className={classes.tagLattice}>#</span>
                                    <TextField
                                        value={newTag}
                                        className={classes.input}

                                        placeholder={allTranslations(localization.organizationAboutPlaceholdersSaleFlowers)}

                                        onBlur={handleAddTag}
                                        onChange={handleChangeNewTag}
                                        onKeyPress={handleEventEnterForm}

                                        fullWidth
                                    />
                                </label>
                            </Grid>

                            <Grid item>
                                <Button
                                    variant={"outlined"}
                                    className={classes.button}
                                    onClick={handleCloseAdd}
                                >
                                    <PlusIcon color={'#8152E4'}/>
                                </Button>
                            </Grid>
                        </Grid>
                    )
                }

                <FormHelperText className={classes.formHelperText} error={!!props.error}>
                    {(!!props.error) ?
                        allTranslations(localization.organizationAboutFill1Tag) :
                        allTranslations(localization.organizationAboutFill12Tag)
                    }
                </FormHelperText>
            </Box>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 8
    },

    tag: {
        flex: 1,
        display: 'flex',

        backgroundColor: 'white',

        padding: '10px 12px',

        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'rgba(168, 171, 184, 0.6)',
        borderRadius: 5,

        fontSize: 16,
        fontFamily: 'Atyp Display',
        lineHeight: '19px',
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: theme.palette.text.primary
    },
    tagLattice: {
        color: '#C4A2FC',

        marginRight: 8
    },

    input: {
        '& .MuiInput-root': {
            border: 'none!important'
        },
        '& .MuiInput-root:before': {
            content: 'none!important'
        },
        '& .MuiInputBase-input': {
            padding: 0,

            fontSize: 16,
            lineHeight: '19px',
            letterSpacing: '0.02em',
            fontFeatureSettings: "'ss03' on, 'ss06' on",
            color: theme.palette.text.primary
        },
    },

    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        height: '100%',

        width: 44,
        minWidth: 44,

        padding: 0,

        borderColor: 'rgba(168, 171, 184, 0.6)'
    },

    formHelperText: {
        marginTop: -8
    }
}));

export default TagsMultiple
