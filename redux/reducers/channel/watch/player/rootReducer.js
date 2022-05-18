
import {combineReducers} from "redux";

import tabsReducer from "./tabs/rootReducer.js";
import categoriesBalloonReducer from "./categoriesBalloonReducer.js";
import episodeDialog from "./episodeDialogReducer.js";

const app = combineReducers({
    tabs: tabsReducer,
    categoriesBalloon: categoriesBalloonReducer,
    episodeDialog: episodeDialog
});

export default app;
