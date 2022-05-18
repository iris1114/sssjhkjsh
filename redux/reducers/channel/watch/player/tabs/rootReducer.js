
import {combineReducers} from "redux";

import channelsTipReducer from "./channelsTipReducer.js";

const app = combineReducers({
    channelsTip: channelsTipReducer,
});

export default app;
