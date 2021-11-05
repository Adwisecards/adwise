import React from "react";
import {
    Box,
    Grid, InputAdornment,
    TextField,
    Typography,
} from "@material-ui/core";
import {
 makeStyles
} from "@material-ui/styles";
import clsx from "clsx";
import allTranslations from "../../../../../localization/allTranslations";
import localization from "../../../../../localization/localization";

const ReferalForm = (props) => {
    const { values, touched, errors, onChange } = props;
    const classes = useStyles();

    const handleOnChange = ({target}) => {
        const { name, value } = target;
        let newValues = {...values};
        newValues[name] = value;
        onChange(newValues);
    }

    return (
        <>

            <Typography className={classes.title}>{allTranslations(localization['coupons_create.referalForm.title'])}</Typography>

            <Box mb={5}>
                <Typography variant="formTitle" className={classes.formTitle}>
                    {allTranslations(localization['coupons_create.referalForm.level1'])}
                </Typography>
                <Grid container alignItems="center" spacing={2} wrap="nowrap">
                    <Grid item>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            type="number"
                            value={values['distributionSchema.first']}
                            name="distributionSchema.first"
                            onChange={handleOnChange}
                            placeholder="10"
                            error={Boolean(touched['distributionSchema.first'] && errors['distributionSchema.first'])}
                            helperText={touched['distributionSchema.first'] && errors['distributionSchema.first']}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <svg width="83" height="44" viewBox="0 0 83 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="#FFF8EE" stroke="#F9D39B"/>
                            <path d="M14 8.10449C15.6308 8.10449 16.9473 9.42098 16.9473 11.0519C16.9473 12.6827 15.6308 13.9992 14 13.9992C12.3691 13.9992 11.0526 12.6827 11.0526 11.0519C11.0526 9.42098 12.3691 8.10449 14 8.10449ZM19.8947 18.894C19.8947 19.4463 19.447 19.894 18.8947 19.894H9.10523C8.55294 19.894 8.10522 19.4463 8.10522 18.894V18.5185C8.10522 16.5536 12.035 15.4729 14 15.4729C15.9649 15.4729 19.8947 16.5536 19.8947 18.5185V18.894Z" fill="#ED8E00"/>
                            <rect x="55.5" y="0.5" width="27" height="27" rx="13.5" fill="#F5EEFF" stroke="#CFA9FF"/>
                            <path d="M69 8.10449C70.6308 8.10449 71.9473 9.42098 71.9473 11.0519C71.9473 12.6827 70.6308 13.9992 69 13.9992C67.3691 13.9992 66.0526 12.6827 66.0526 11.0519C66.0526 9.42098 67.3691 8.10449 69 8.10449ZM74.8947 18.894C74.8947 19.4463 74.447 19.894 73.8947 19.894H64.1052C63.5529 19.894 63.1052 19.4463 63.1052 18.894V18.5185C63.1052 16.5536 67.035 15.4729 69 15.4729C70.9649 15.4729 74.8947 16.5536 74.8947 18.5185V18.894Z" fill="#8152E4"/>
                            <line x1="51" y1="14.5" x2="32" y2="14.5" stroke="#F9D39B"/>
                            <path d="M14.3536 29.6464C14.1583 29.4512 13.8417 29.4512 13.6464 29.6464L10.4645 32.8284C10.2692 33.0237 10.2692 33.3403 10.4645 33.5355C10.6597 33.7308 10.9763 33.7308 11.1716 33.5355L14 30.7071L16.8284 33.5355C17.0237 33.7308 17.3403 33.7308 17.5355 33.5355C17.7308 33.3403 17.7308 33.0237 17.5355 32.8284L14.3536 29.6464ZM66 37.9999L66 38.4999L66 37.9999ZM17 38L17 38.5L17 38ZM14.5 35L14.5 30L13.5 30L13.5 35L14.5 35ZM68.5 30L68.5 34.9999L69.5 34.9999L69.5 30L68.5 30ZM66 37.4999L17 37.5L17 38.5L66 38.4999L66 37.4999ZM68.5 34.9999C68.5 36.3806 67.3807 37.4999 66 37.4999L66 38.4999C67.933 38.4999 69.5 36.9329 69.5 34.9999L68.5 34.9999ZM13.5 35C13.5 36.933 15.067 38.5 17 38.5L17 37.5C15.6193 37.5 14.5 36.3807 14.5 35L13.5 35Z" fill="#CFA9FF"/>
                            <rect x="35" y="32" width="12" height="12" rx="6" fill="#8152E4"/>
                            <path d="M37.8407 38.32C37.5581 37.9893 37.4167 37.576 37.4167 37.08C37.4167 36.584 37.5581 36.1733 37.8407 35.848C38.1234 35.5173 38.4834 35.352 38.9207 35.352C39.3581 35.352 39.7181 35.5173 40.0007 35.848C40.2834 36.1733 40.4247 36.584 40.4247 37.08C40.4247 37.576 40.2834 37.9893 40.0007 38.32C39.7181 38.6453 39.3581 38.808 38.9207 38.808C38.4834 38.808 38.1234 38.6453 37.8407 38.32ZM39.7767 41H38.9287L42.2247 35.4H43.0727L39.7767 41ZM38.3767 36.32C38.2381 36.5227 38.1687 36.776 38.1687 37.08C38.1687 37.384 38.2381 37.6373 38.3767 37.84C38.5154 38.0373 38.6967 38.136 38.9207 38.136C39.1394 38.136 39.3181 38.0373 39.4567 37.84C39.6007 37.6373 39.6727 37.384 39.6727 37.08C39.6727 36.776 39.6007 36.5227 39.4567 36.32C39.3181 36.1173 39.1394 36.016 38.9207 36.016C38.7021 36.016 38.5207 36.1173 38.3767 36.32ZM42.0007 40.56C41.7181 40.2293 41.5767 39.816 41.5767 39.32C41.5767 38.824 41.7181 38.4133 42.0007 38.088C42.2834 37.7573 42.6434 37.592 43.0807 37.592C43.5181 37.592 43.8781 37.7573 44.1607 38.088C44.4434 38.4133 44.5847 38.824 44.5847 39.32C44.5847 39.816 44.4434 40.2293 44.1607 40.56C43.8781 40.8853 43.5181 41.048 43.0807 41.048C42.6434 41.048 42.2834 40.8853 42.0007 40.56ZM42.5367 38.56C42.3981 38.7627 42.3287 39.016 42.3287 39.32C42.3287 39.624 42.3981 39.8773 42.5367 40.08C42.6754 40.2773 42.8567 40.376 43.0807 40.376C43.3047 40.376 43.4861 40.2773 43.6247 40.08C43.7634 39.8773 43.8327 39.624 43.8327 39.32C43.8327 39.016 43.7607 38.7627 43.6167 38.56C43.4781 38.3573 43.2994 38.256 43.0807 38.256C42.8621 38.256 42.6807 38.3573 42.5367 38.56Z" fill="white"/>
                        </svg>
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.message}
                            dangerouslySetInnerHTML={{
                                __html: allTranslations(
                                    localization['coupons_create.referalForm.levelsMessage'],
                                    {
                                        first: values['distributionSchema.first'] || 0
                                    }
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle" className={classes.formTitle}>{allTranslations(localization['coupons_create.referalForm.level2'])}</Typography>
                <Grid container alignItems="center" spacing={2} wrap="nowrap">
                    <Grid item>
                        <TextField
                            className={classes.textField}
                            variant="outlined"
                            type="number"
                            value={values['distributionSchema.other']}
                            name="distributionSchema.other"
                            onChange={handleOnChange}
                            placeholder="10"
                            error={Boolean(touched['distributionSchema.other'] && errors['distributionSchema.other'])}
                            helperText={touched['distributionSchema.other'] && errors['distributionSchema.other']}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <svg width="154" height="44" viewBox="0 0 154 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="#FFF8EE" stroke="#F9D39B"/>
                            <path d="M14 8.10449C15.6308 8.10449 16.9473 9.42098 16.9473 11.0519C16.9473 12.6827 15.6308 13.9992 14 13.9992C12.3691 13.9992 11.0526 12.6827 11.0526 11.0519C11.0526 9.42098 12.3691 8.10449 14 8.10449ZM19.8947 18.894C19.8947 19.4463 19.447 19.894 18.8947 19.894H9.10523C8.55294 19.894 8.10522 19.4463 8.10522 18.894V18.5185C8.10522 16.5536 12.035 15.4729 14 15.4729C15.9649 15.4729 19.8947 16.5536 19.8947 18.5185V18.894Z" fill="#ED8E00"/>
                            <rect x="42" width="28" height="28" rx="14" fill="#F5EEFF"/>
                            <path d="M56 8.10449C57.6308 8.10449 58.9473 9.42098 58.9473 11.0519C58.9473 12.6827 57.6308 13.9992 56 13.9992C54.3691 13.9992 53.0526 12.6827 53.0526 11.0519C53.0526 9.42098 54.3691 8.10449 56 8.10449ZM61.8947 18.894C61.8947 19.4463 61.447 19.894 60.8947 19.894H51.1052C50.5529 19.894 50.1052 19.4463 50.1052 18.894V18.5185C50.1052 16.5536 54.035 15.4729 56 15.4729C57.9649 15.4729 61.8947 16.5536 61.8947 18.5185V18.894Z" fill="#CFA9FF"/>
                            <rect x="84" width="28" height="28" rx="14" fill="#F5EEFF"/>
                            <path d="M98 8.10449C99.6308 8.10449 100.947 9.42098 100.947 11.0519C100.947 12.6827 99.6308 13.9992 98 13.9992C96.3691 13.9992 95.0526 12.6827 95.0526 11.0519C95.0526 9.42098 96.3691 8.10449 98 8.10449ZM103.895 18.894C103.895 19.4463 103.447 19.894 102.895 19.894H93.1052C92.5529 19.894 92.1052 19.4463 92.1052 18.894V18.5185C92.1052 16.5536 96.035 15.4729 98 15.4729C99.9649 15.4729 103.895 16.5536 103.895 18.5185V18.894Z" fill="#CFA9FF"/>
                            <rect x="126.5" y="0.5" width="27" height="27" rx="13.5" fill="#F5EEFF" stroke="#CFA9FF"/>
                            <path d="M140 8.10449C141.631 8.10449 142.947 9.42098 142.947 11.0519C142.947 12.6827 141.631 13.9992 140 13.9992C138.369 13.9992 137.053 12.6827 137.053 11.0519C137.053 9.42098 138.369 8.10449 140 8.10449ZM145.895 18.894C145.895 19.4463 145.447 19.894 144.895 19.894H135.105C134.553 19.894 134.105 19.4463 134.105 18.894V18.5185C134.105 16.5536 138.035 15.4729 140 15.4729C141.965 15.4729 145.895 16.5536 145.895 18.5185V18.894Z" fill="#8152E4"/>
                            <line x1="39" y1="14.5" x2="31" y2="14.5" stroke="#F9D39B"/>
                            <line x1="81" y1="14.5" x2="73" y2="14.5" stroke="#F9D39B"/>
                            <line x1="123" y1="14.5" x2="115" y2="14.5" stroke="#F9D39B"/>
                            <path d="M14.3536 29.6464C14.1583 29.4512 13.8417 29.4512 13.6464 29.6464L10.4645 32.8284C10.2692 33.0237 10.2692 33.3403 10.4645 33.5355C10.6597 33.7308 10.9763 33.7308 11.1716 33.5355L14 30.7071L16.8284 33.5355C17.0237 33.7308 17.3403 33.7308 17.5355 33.5355C17.7308 33.3403 17.7308 33.0237 17.5355 32.8284L14.3536 29.6464ZM137 37.9999L137 37.4999L137 37.9999ZM17 38L17 38.5L17 38ZM14.5 35L14.5 30L13.5 30L13.5 35L14.5 35ZM139.5 30L139.5 34.9999L140.5 34.9999L140.5 30L139.5 30ZM137 37.4999L17 37.5L17 38.5L137 38.4999L137 37.4999ZM139.5 34.9999C139.5 36.3806 138.381 37.4999 137 37.4999L137 38.4999C138.933 38.4999 140.5 36.9329 140.5 34.9999L139.5 34.9999ZM13.5 35C13.5 36.933 15.067 38.5 17 38.5L17 37.5C15.6193 37.5 14.5 36.3807 14.5 35L13.5 35Z" fill="#CFA9FF"/>
                            <rect x="71" y="32" width="12" height="12" rx="6" fill="#8152E4"/>
                            <path d="M73.8407 38.32C73.5581 37.9893 73.4167 37.576 73.4167 37.08C73.4167 36.584 73.5581 36.1733 73.8407 35.848C74.1234 35.5173 74.4834 35.352 74.9207 35.352C75.3581 35.352 75.7181 35.5173 76.0007 35.848C76.2834 36.1733 76.4247 36.584 76.4247 37.08C76.4247 37.576 76.2834 37.9893 76.0007 38.32C75.7181 38.6453 75.3581 38.808 74.9207 38.808C74.4834 38.808 74.1234 38.6453 73.8407 38.32ZM75.7767 41H74.9287L78.2247 35.4H79.0727L75.7767 41ZM74.3767 36.32C74.2381 36.5227 74.1687 36.776 74.1687 37.08C74.1687 37.384 74.2381 37.6373 74.3767 37.84C74.5154 38.0373 74.6967 38.136 74.9207 38.136C75.1394 38.136 75.3181 38.0373 75.4567 37.84C75.6007 37.6373 75.6727 37.384 75.6727 37.08C75.6727 36.776 75.6007 36.5227 75.4567 36.32C75.3181 36.1173 75.1394 36.016 74.9207 36.016C74.7021 36.016 74.5207 36.1173 74.3767 36.32ZM78.0007 40.56C77.7181 40.2293 77.5767 39.816 77.5767 39.32C77.5767 38.824 77.7181 38.4133 78.0007 38.088C78.2834 37.7573 78.6434 37.592 79.0807 37.592C79.5181 37.592 79.8781 37.7573 80.1607 38.088C80.4434 38.4133 80.5847 38.824 80.5847 39.32C80.5847 39.816 80.4434 40.2293 80.1607 40.56C79.8781 40.8853 79.5181 41.048 79.0807 41.048C78.6434 41.048 78.2834 40.8853 78.0007 40.56ZM78.5367 38.56C78.3981 38.7627 78.3287 39.016 78.3287 39.32C78.3287 39.624 78.3981 39.8773 78.5367 40.08C78.6754 40.2773 78.8567 40.376 79.0807 40.376C79.3047 40.376 79.4861 40.2773 79.6247 40.08C79.7634 39.8773 79.8327 39.624 79.8327 39.32C79.8327 39.016 79.7607 38.7627 79.6167 38.56C79.4781 38.3573 79.2994 38.256 79.0807 38.256C78.8621 38.256 78.6807 38.3573 78.5367 38.56Z" fill="white"/>
                        </svg>
                    </Grid>
                    <Grid item>
                        <Typography
                            className={classes.message}
                            dangerouslySetInnerHTML={{
                                __html: allTranslations(
                                    localization['coupons_create.referalForm.levelsMessage'],
                                    {
                                        first: Number.parseFloat(values['distributionSchema.other']) / 20 || 0
                                    }
                                )
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle" className={classes.formTitle}>{allTranslations(localization['coupons_create.referalForm.adwiseExpenses'])}</Typography>
                <Grid container alignItems="center" spacing={2} wrap="nowrap">
                    <Grid item>
                        <TextField
                            className={clsx([classes.textField, classes.textFieldDisabled])}
                            variant="outlined"
                            type="number"
                            disabled
                            value={5}
                            placeholder="10"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography className={classes.message}>
                            {allTranslations(localization['coupons_create.referalForm.adwiseExpensesMessage'])}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            <Box mb={5}>
                <Typography variant="formTitle" className={classes.formTitle}>{allTranslations(localization['coupons_create.referalForm.offerPercent'])}</Typography>
                <TextField
                    variant="outlined"
                    type="number"
                    value={values['offerPercent']}
                    name="offerPercent"
                    onChange={handleOnChange}
                    placeholder="10"
                    fullWidth
                    error={Boolean(touched.offerPercent && errors.offerPercent)}
                    helperText={touched.offerPercent && errors.offerPercent}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                />
            </Box>

        </>
    )
}

const useStyles = makeStyles(() => ({

    title: {

        fontSize: 22,
        lineHeight: '26px',
        marginBottom: 24,
        letterSpacing: '0.02em',
        fontFeatureSettings: "'ss03' on, 'ss06' on",
        color: "#25233E"

    },

    formTitle: {
        marginBottom: 8
    },

    message: {
        fontSize: 12,
        color: '#999DB1',
        lineHeight: '14px',
        fontFeatureSettings: "'ss03' on, 'ss06' on"
    },

    textField: {
        width: 120
    },
    textFieldDisabled: {
        backgroundColor: 'rgba(168, 171, 184, 0.05)',
        pointerEvents: "none",

        '& input': {
            backgroundColor: 'rgba(168, 171, 184, 0.05)',
            color: 'black',
        }
    },
}));

export default ReferalForm
