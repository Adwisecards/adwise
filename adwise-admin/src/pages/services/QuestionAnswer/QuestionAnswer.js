import React, { Component } from "react";
import {
    Box,
    Grid,
    Button,
    Tooltip,
    Typography, Tabs, Tab, CircularProgress, Backdrop
} from "@material-ui/core";
import {
    Table,
    Filter,
    DialogEdit,
    DialogCreated,
    TableCategories,
    DialogEditCategories,
    DialogCreatedCategories
} from "./components";
import {
    Plus as PlusIcon
} from "react-feather";
import {
    ConfirmationDialog, TextWYSIWYG
} from "../../../components";
import axiosInstance from "../../../agent/agent";
import apiUrls from "../../../constants/apiUrls";
import alertNotification from "../../../common/alertNotification";
import {formatUnicode} from "../../../helper/formatUnicodeMarkdown";

class QuestionAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: "question-answer",

            rows: [
                {
                    platform: ['crm', 'cards'],
                    group: "02",
                    question: "Таким образом постоянное информационно-пропагандистское обеспечение нашей деятельности обеспечивает широкому кругу (специалистов) участие в формировании форм развития.",
                    answer: "Разнообразный и богатый опыт сложившаяся структура организации в значительной степени обуславливает создание направлений прогрессивного развития. Таким образом консультация с широким активом позволяет выполнять важные задания по разработке системы обучения кадров, соответствует насущным потребностям."
                }
            ],
            categories: [],

            filter: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1,

                type: "crm"
            },
            filterCategories: {
                sortBy: 'timestamp',
                order: -1,

                pageSize: 20,
                pageNumber: 1
            },
            pagination: {
                countPages: 1
            },
            paginationCategories: {
                countPages: 1
            },
            rowDelete: {},
            rowEdit: {},
            rowDeleteCategory: {},
            rowEditCategory: {},

            totalCountRows: 0,

            isLoading: true,
            isLoadingCategories: true,
            isOpenCreate: false,
            isShowBackdrop: false,
            isOpenConfirm: false,
            isOpenConfirmCategory: false,
            isOpenEdit: false,
            isOpenCreateCategories: false,
            isOpenEditCategories: false
        };
    }

    componentDidMount = () => {
        this.getListQuestionAnswer();
        this.getListCategories();
    }

    getListQuestionAnswer = () => {
        this.setState({ isLoading: true });

        axiosInstance.get(`${apiUrls["get-questions"]}/${ this.state.filter.type }`).then((response) => {
            this.setState({
                rows: response.data.data.questions,
                isLoading: false
            })
        });
    }
    getListCategories = () => {
        this.setState({ isLoadingCategories: true });

        axiosInstance.get(`${apiUrls["get-question-categories"]}`).then((response) => {
            this.setState({
                categories: response.data.data.questionCategories,
                isLoadingCategories: false
            })
        });
    }

    onChangeFilter = (filter, isFastStart) => {
        this.setState({ filter }, () => {
            if (isFastStart) {
                this.getListQuestionAnswer()
            }
        });
    }

    onCreate = (form) => {
        this.setState({ isShowBackdrop: true });

        form.answer = formatUnicode(form.answer);

        axiosInstance.post(`${ apiUrls["create-question"] }`, form).then((response) => {
            alertNotification({
                title: "Системное уведомление",
                message: "Вопрос-ответ успешно создан",
                type: "success"
            })
            this.setState({
                isShowBackdrop: false,
                isOpenCreate: false
            });
            this.getListQuestionAnswer();
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });
            alertNotification({
                title: "Системное уведомление",
                message: "Произошла ошибка",
                type: "danger"
            })
        })
    }
    onDelete = (row, isConfirm) => {
        if (!isConfirm) {
            this.setState({ isOpenConfirm: true, rowDelete: row })

            return null
        }

        this.setState({ isShowBackdrop: true });

        axiosInstance.delete(`${ apiUrls["delete-question"] }/${row._id}`).then((response) => {
            this.setState({ isShowBackdrop: false, isOpenConfirm: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Вопрос-ответ успешно удалено",
                type: "success"
            })
            this.getListQuestionAnswer();
        });
    }
    onEdit = (row, isSubmit) => {
        if (!isSubmit) {
            row.categoryId = row.category._id;
            this.setState({ rowEdit: row, isOpenEdit: true })

            return null
        }

        this.setState({ isShowBackdrop: true })

        delete row.category;

        row.answer = formatUnicode(row.answer);
        console.log('row.answer: ', row.answer)

        axiosInstance.put(`${ apiUrls["update-question"] }/${ row._id }`, row).then((response) => {
            this.setState({ isOpenEdit: false, isShowBackdrop: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Вопрос-ответ успешно изменен",
                type: "success"
            })
            this.getListQuestionAnswer();
        }).catch((error) => {
            this.setState({ isShowBackdrop: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Произошла ошибка",
                type: "danger"
            })
        })
    }

    onCreateCategory = (form) => {
        this.setState({ isShowBackdrop: true });

        axiosInstance.post(`${ apiUrls["create-question-category"] }`, form).then((response) => {
            this.setState({
                isShowBackdrop: false,
                isOpenCreateCategories: false
            });
            alertNotification({
                title: "Системное уведомление",
                message: "Категория успешно добавлена",
                type: "success"
            })
            this.getListCategories();
        }).catch((error) => {
            this.setState({
                isShowBackdrop: false
            });
            alertNotification({
                title: "Системное уведомление",
                message: "Произошла ошибка",
                type: "danger"
            })
        })
    }
    onDeleteCategory = (row, isConfirm) => {
        if (!isConfirm) {
            this.setState({ isOpenConfirmCategory: true, rowDeleteCategory: row })

            return null
        }

        axiosInstance.delete(`${ apiUrls["delete-question-category"] }/${ row._id }`).then((response) => {
            this.setState({ isShowBackdrop: false, isOpenConfirmCategory: false });
            alertNotification({
                title: "Системное уведомление",
                message: "Категория успешно удалена",
                type: "success"
            })
            this.getListCategories();
        })
    }
    onEditCategory = (row, isSubmit) => {
        if (!isSubmit) {
            this.setState({ rowEditCategory: row, isOpenEditCategories: true })

            return null
        }

        console.log('row: ', row)
    }

    render() {
        const {
            rows, filter, pagination, totalCountRows,
            isLoading, isShowBackdrop, isOpenCreate,
            isOpenConfirm, rowDelete, rowEdit, isOpenEdit,
            tab, isOpenCreateCategories, categories,
            paginationCategories, filterCategories, isLoadingCategories,
            isOpenEditCategories, rowEditCategory, isOpenConfirmCategory,
            rowDeleteCategory
        } = this.state;

        return (
            <>

                <Box mb={2}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h1">Вопрос/Ответ</Typography>
                        </Grid>
                        <Grid item>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Tooltip title="Создать вопрос/ответ">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            style={{padding: '6px 10px', minWidth: 0}}

                                            onClick={() => this.setState({ isOpenCreate: true })}
                                        >
                                            <PlusIcon color="#8152E4" style={{ marginRight: 8 }}/>
                                            Вопрос/ответ
                                        </Button>
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Создать категорию">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            style={{padding: '6px 10px', minWidth: 0}}

                                            onClick={() => this.setState({ isOpenCreateCategories: true })}
                                        >
                                            <PlusIcon color="#8152E4" style={{ marginRight: 8 }}/>
                                            Категория
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                <Box mb={3}>
                    <Tabs value={tab} onChange={(event, tab) => this.setState({tab})}>
                        <Tab value="question-answer" label="Вопрос/Ответ"/>
                        <Tab value="categories" label="Категории"/>
                    </Tabs>
                </Box>

                <Box>
                    {
                        (tab === "question-answer") && (
                            <>
                                <Box mb={3}>
                                    <Filter
                                        filter={filter}

                                        onChange={this.onChangeFilter}
                                        onSearch={this.getListQuestionAnswer}
                                    />
                                </Box>
                                <Box>
                                    <Table
                                        rows={rows}
                                        pagination={pagination}
                                        filter={filter}
                                        isLoading={isLoading}

                                        onDelete={this.onDelete}
                                        onEdit={this.onEdit}
                                    />
                                </Box>
                            </>
                        )
                    }
                    {
                        (tab === "categories") && (
                            <TableCategories
                                rows={categories}
                                questionAnswer={rows}
                                pagination={paginationCategories}
                                filter={filterCategories}
                                isLoading={isLoadingCategories}

                                onDelete={this.onDeleteCategory}
                                onEdit={this.onEditCategory}
                            />
                        )
                    }
                </Box>

                <DialogCreated
                    isOpen={isOpenCreate}
                    groups={categories}
                    onCreate={this.onCreate}
                    onClose={() => this.setState({ isOpenCreate: false })}
                />

                <DialogEdit
                    isOpen={isOpenEdit}
                    groups={categories}
                    initialForm={rowEdit}
                    onEdit={this.onEdit}
                    onClose={() => this.setState({ isOpenEdit: false })}
                />

                <DialogCreatedCategories
                    isOpen={isOpenCreateCategories}
                    onCreate={this.onCreateCategory}
                    onClose={() => this.setState({ isOpenCreateCategories: false })}
                />
                <DialogEditCategories
                    isOpen={isOpenEditCategories}
                    initialForm={rowEditCategory}
                    onEdit={this.onEditCategory}
                    onClose={() => this.setState({ isOpenEditCategories: false })}
                />


                <ConfirmationDialog
                    isOpen={isOpenConfirm}
                    onConfirm={() => this.onDelete(rowDelete, true)}
                    onClose={() => this.setState({ isOpenConfirm: false })}
                />

                <ConfirmationDialog
                    isOpen={isOpenConfirmCategory}
                    onConfirm={() => this.onDeleteCategory(rowDeleteCategory, true)}
                    onClose={() => this.setState({ isOpenConfirmCategory: false })}
                />

                <Backdrop open={this.state.isShowBackdrop} invisible={this.state.isShowBackdrop}>
                    <CircularProgress size={80} style={{color: 'white'}}/>
                </Backdrop>

            </>
        );
    }
}

export default QuestionAnswer
