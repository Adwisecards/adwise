import organization from "./organization";
import ui from "./ui";
import user from "./user";

const { combineReducers } = require("redux");

export const rootReducer = combineReducers({
    organization: organization,
    user: user,
    ui: ui
});