
import {combineReducers} from "redux";

import showReducer from "./showReducer.js";

const app = combineReducers({
    show: showReducer
});

export default app;
