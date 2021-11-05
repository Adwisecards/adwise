import React, {Component} from 'react';
import {
    Section as SectionComponent
} from "./components";
import "./classes.css";
import axiosInstance from "../../agent/agent";

class QuestionAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionAnswer: [],
        }
    }

    componentDidMount = async () => {
        await this.getQuestionAnswers();
    }

    getQuestionAnswers = async () => {
        let sections = {};
        const questions = await axiosInstance.get('/administration/get-questions-by-type/crm').then((response) => {
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
        const { questionAnswer } = this.state;

        return (
            <section className="container">

                <h1 className="title">Вопрос-ответ</h1>

                <div className="sections">
                    {
                        Object.keys(questionAnswer).map((key) => {
                            const section = questionAnswer[key];

                            return (
                                <SectionComponent
                                    {...section}
                                />
                            )
                        })
                    }
                </div>

            </section>
        );
    }
}

export default QuestionAnswer
