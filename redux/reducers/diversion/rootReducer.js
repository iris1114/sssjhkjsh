
import { combineReducers } from "redux";

import featuredReducer from "./featuredReducer.js";
import rankReducer from "./rankReducer.js";

const app = combineReducers({
    featured: featuredReducer,
    rank: rankReducer
});

export default app;
