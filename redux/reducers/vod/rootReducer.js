
import {combineReducers} from "redux";

import watchReducer from "./watch/rootReducer.js";

const app = combineReducers({
    watch: watchReducer
});

export default app;
