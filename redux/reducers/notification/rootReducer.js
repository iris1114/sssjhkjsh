
import {combineReducers} from "redux";

import permissionReducer from "./permissionReducer.js";

const app = combineReducers({
    permission: permissionReducer
});

export default app;
