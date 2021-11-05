import React, {Component} from 'react';
import {
    Box,
    Grid,
    Typography
} from "@material-ui/core";
import {
    Section
} from "./components";
import urls from "../../../constants/urls";
import axiosInstance from "../../../agent/agent";
import allTranslations from "../../../localization/allTranslations";
import localization from "../../../localization/localization";

class QuestionAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionAnswer: [],

            isLoading: true
        }
    }

    componentDidMount = async () => {
        await this.getQuestionAnswer();
    }

    getQuestionAnswer = async () => {
        let sections = {};
        const questions = await axiosInstance.get(urls["get-questions-by-type"]).then((response) => {
            return response.data.data.questions
        }).catch((error) => {
            return []
        });

        questions.map(question => {
            if (!sections[question.category._id]){
                sections[question.category._id] = {
                    title: question.category.name,
                    items: []
                }
            }

            sections[question.category._id]['items'].push(question)
        })

        this.setState({ questionAnswer: sections })
    }

    render() {
        const {questionAnswer, isLoading} = this.state;

        return (
            <>
                <Box mb={5}>
                    <Typography variant="h1">{allTranslations(localization['questionAnswer.title'])}</Typography>
                </Box>

                <Box maxWidth="700px">
                    {
                        Object.keys(questionAnswer).map((key, idx) => (
                            <Section key={`section-${idx}`} {...questionAnswer[key]}/>
                        ))
                    }
                </Box>

            </>
        );
    }

}

export default QuestionAnswer
