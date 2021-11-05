import { Document, model, Model, Schema } from "mongoose";

export const TagSchema = new Schema({
    name: {
        type: String,
        required: true,
        //unique: true
    }
});

interface ITagSchema extends Document {
    name: string;
};

export interface ITag extends ITagSchema {

};

export interface ITagModel extends Model<ITag> {

};

export const TagModel = model<ITag, ITagModel>('tag', TagSchema);