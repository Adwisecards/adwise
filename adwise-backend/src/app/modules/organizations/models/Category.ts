import { Document, model, Model, Schema } from "mongoose";

export const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

interface ICategorySchema extends Document {
    name: string;
};

export interface ICategory extends ICategorySchema {

};

export interface ICategoryModel extends Model<ICategory> {

};

export const CategoryModel = model<ICategory, ICategoryModel>('category', CategorySchema);