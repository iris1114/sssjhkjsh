
import { createStore } from "redux";

import reducer from "./reducers/rootReducer.js";

const store = createStore(reducer);

export default store;
