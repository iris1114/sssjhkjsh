
import {combineReducers} from "redux";

import accountVarUpdateReducer from "./accountVarUpdateReducer.js";

const app = combineReducers({
    accountVarUpdate: accountVarUpdateReducer
});

export default app;