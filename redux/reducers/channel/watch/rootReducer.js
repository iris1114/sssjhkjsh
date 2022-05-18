
import {combineReducers} from "redux";

import programInfoReducer from "./programInfoReducer.js";
import maskReducer from "./maskReducer.js";
import playerReducer from "./player/rootReducer.js";
import categoriesTipReducer from "./categoriesTipReducer.js";

const app = combineReducers({
    programInfo: programInfoReducer,
    mask: maskReducer,
    player: playerReducer,
    categoriesTip: categoriesTipReducer
});

export default app;
