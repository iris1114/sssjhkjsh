
import {combineReducers} from "redux";

import showReducer from "./showReducer.js";
import heightReducer from "./heightReducer.js";
import focusReducer from "./focusReducer.js";
import searchOptionsTriggerReducer from "./searchOptionsTriggerReducer.js";
import loginStatusBalloonTriggerReducer from "./loginStatusBalloonTriggerReducer.js";
import bottomOverflowItemsReducer from "./bottomOverflowItemsReducer.js";
import bottomOverflowMenuTriggerReducer from "./bottomOverflowMenuTriggerReducer.js";

const app = combineReducers({
    show: showReducer,
    height: heightReducer,
    focus: focusReducer,
    searchOptionsTrigger: searchOptionsTriggerReducer,
    loginStatusBalloonTrigger: loginStatusBalloonTriggerReducer,
    bottomOverflowItems: bottomOverflowItemsReducer,
    bottomOverflowMenuTrigger: bottomOverflowMenuTriggerReducer
});

export default app;
