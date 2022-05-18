
import {combineReducers} from "redux";

import stepReducer from "./stepReducer.js";
import packageInfoReducer from "./packageInfoReducer.js";
import packageItemReducer from "./packageItemReducer.js";
import payMethodItemReducer from "./payMethodItemReducer.js";
import optionPackageItemReducer from "./optionPackageItemReducer.js";
import promocodeItemReducer from "./promocodeItemReducer.js";
import recurrentReducer from "./recurrentReducer.js";
import invoiceReducer from "./invoiceReducer.js";
import purchaseInfoReducer from "./purchaseInfoReducer.js";
import orderInfoReducer from "./orderInfoReducer.js";
import sumitClickReducer from "./sumitClickReducer.js";

const app = combineReducers({
    step: stepReducer,
    packageInfo: packageInfoReducer,
    packageItem: packageItemReducer,
    payMethodItem: payMethodItemReducer,
    optionPackageItem: optionPackageItemReducer,
    promocodeItem: promocodeItemReducer,
    recurrent: recurrentReducer,
    invoice: invoiceReducer,
    purchaseInfo: purchaseInfoReducer,
    orderInfo: orderInfoReducer,
    sumitClick: sumitClickReducer
});

export default app;
