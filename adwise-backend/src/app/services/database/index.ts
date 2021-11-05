import { configProps } from "../config";
import { Database } from "./implementation/Database";

const isProd = configProps.nodeEnv.toLowerCase() == 'production';

const database = new Database(isProd);

export {
    database
};