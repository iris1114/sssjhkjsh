
import {combineReducers} from "redux";

import adReducer from "./adReducer.js";

const app = combineReducers({
    ad: adReducer
});

export default app;
