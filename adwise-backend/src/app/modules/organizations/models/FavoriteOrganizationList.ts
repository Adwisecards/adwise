import { Document, Model, model, Schema, Types } from "mongoose";

export const FavoriteOrganizationListSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    organizations: [{
        type: Types.ObjectId,
        ref: 'organization'
    }]
});

interface IFavoriteOrganizationListSchema extends Document {
    
};

interface IFavoriteOrganizationListBase extends IFavoriteOrganizationListSchema {

};

export interface IFavoriteOrganizationList extends IFavoriteOrganizationListBase {
    user: Types.ObjectId;
    organizations: Types.ObjectId[];
};

export interface IFavoriteOrganizationListModel extends Model<IFavoriteOrganizationList> {
    
};

export const FavoriteOrganizationListModel = model<IFavoriteOrganizationList, IFavoriteOrganizationListModel>('favoriteorganizationlist', FavoriteOrganizationListSchema);