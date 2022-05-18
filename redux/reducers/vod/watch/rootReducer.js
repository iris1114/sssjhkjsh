
import { combineReducers } from "redux";

import programInfoReducer from "./programInfoReducer.js";
import programInfoByRelatedProgramReducer from "./programInfoByRelatedProgramReducer.js";
import shareBalloonTriggerReducer from "./shareBalloonTriggerReducer.js";
import videoImpressionReducer from "./videoImpressionReducer.js";
import videoCompanionAdReducer from "./videoCompanionAdReducer.js";
import videoUrlsReducer from "./videoUrlsReducer.js";
import videoSeekReducer from "./videoSeekReducer.js";

const app = combineReducers({
    programInfo: programInfoReducer,
    programInfoByRelatedProgram: programInfoByRelatedProgramReducer,
    shareBalloonTrigger: shareBalloonTriggerReducer,
    videoImpression: videoImpressionReducer,
    videoCompanionAd: videoCompanionAdReducer,
    videoUrls: videoUrlsReducer,
    videoSeek: videoSeekReducer
});

export default app;
