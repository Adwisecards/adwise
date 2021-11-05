import { Document, model, Model, Schema } from "mongoose";

const QuestionCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

interface IQuestionCategorySchema extends Document {
    name: string;
};

interface IQuestionCategoryBase extends IQuestionCategorySchema {

};

export interface IQuestionCategory extends IQuestionCategoryBase {

};

export interface IQuestionCategoryModel extends Model<IQuestionCategory> {

};

export const QuestionCategoryModel = model<IQuestionCategory, IQuestionCategoryModel>('questioncategory', QuestionCategorySchema);