import { Document, model, Model, Schema } from "mongoose";
import MediaType from "../../../core/static/MediaType";
import MimeType from "../../../core/static/MimeTypes";

export const MediaSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: MediaType.getList()
    },
    filename: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true,
        enum: MimeType.getList()
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

interface IMediaSchema extends Document {
    type: string;
    filename: string;
    mimeType: string;
    timestamp: Date;
};

interface IMediaBase extends IMediaSchema {

};

export interface IMedia extends IMediaBase {

};

export interface IMediaModel extends Model<IMedia> {

};

export const MediaModel = model<IMedia, IMediaModel>('media', MediaSchema);