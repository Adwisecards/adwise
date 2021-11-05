import { Document, model, Model, Schema } from "mongoose";

export const AppSchema = new Schema({
    cards: {
        ios: {
            versions: {
                stable: {
                    type: String,
                    default: '1.0.0'
                },
                latest: {
                    type: String,
                    default: '1.0.0'
                },
                deprecated: {
                    type: String,
                    default: '0.0.0'
                }
            }
        },
        android: {
            versions: {
                stable: {
                    type: String,
                    default: '1.0.0'
                },
                latest: {
                    type: String,
                    default: '1.0.0'
                },
                deprecated: {
                    type: String,
                    default: '0.0.0'
                }
            }
        }
    },
    business: {
        ios: {
            versions: {
                stable: {
                    type: String,
                    default: '1.0.0'
                },
                latest: {
                    type: String,
                    default: '1.0.0'
                },
                deprecated: {
                    type: String,
                    default: '0.0.0'
                }
            }
        },
        android: {
            versions: {
                stable: {
                    type: String,
                    default: '1.0.0'
                },
                latest: {
                    type: String,
                    default: '1.0.0'
                },
                deprecated: {
                    type: String,
                    default: '0.0.0'
                }
            }
        }
    }
});

type Version = string;

type Platform = {
    versions: {
        stable: Version;
        latest: Version;
        deprecated: Version;
    };
};

type App = {
    ios: Platform;
    android: Platform;
};

interface IAppSchema extends Document {
    cards: App;
    business: App;
};

interface IAppBase extends IAppSchema {

};

export interface IApp extends IAppBase {

};

export interface IAppModel extends Model<IApp> {

};

export const AppModel = model<IApp, IAppModel>('app', AppSchema);