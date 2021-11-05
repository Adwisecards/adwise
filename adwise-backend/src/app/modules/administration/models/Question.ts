import { Document, model, Model, Schema, Types } from "mongoose";
import QuestionType from "../../../core/static/QuestionType";

const QuestionSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: QuestionType.getList()
    },
    category: {
        type: Types.ObjectId,
        ref: 'questioncategory',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

interface IQuestionSchema extends Document {
    type: string;
    question: string;
    answer: string;
};

interface IQuestionBase extends IQuestionSchema {

};

export interface IQuestion extends IQuestionBase {
    category: Types.ObjectId;
};

export interface IQuestionModel extends Model<IQuestion> {

};

export const QuestionModel = model<IQuestion, IQuestionModel>('question', QuestionSchema);