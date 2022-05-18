
import {combineReducers} from "redux";

import showReducer from "./showReducer.js";
import topReducer from "./top/rootReducer.js";

const app = combineReducers({
    show: showReducer,
    top: topReducer
});

export default app;
