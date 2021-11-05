import { Document, model, Model, Schema, Types } from "mongoose";

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    author: {
        type: Types.ObjectId,
        ref: 'contact',
        required: true
    },
    time: {
        type: String,
        min: 5,
        max: 5,
        required: true
    },
    participants: [{
        type: Types.ObjectId,
        ref: 'contact'
    }]
});

interface ITaskSchema extends Document {
    name: string;
    description: string;
    date: Date;
    time: string;
};

interface ITaskBase extends ITaskSchema {
    // Methods and virtuals
};

export interface ITask extends ITaskBase {
    participants: Types.ObjectId[];
    author: Types.ObjectId
};

export interface ITaskModel extends Model<ITask> {
    // statics
};

export const TaskModel = model<ITask, ITaskModel>('task', TaskSchema);