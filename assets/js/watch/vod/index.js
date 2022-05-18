
import entryPoint from "./entryPoint.js";
import getEntry from "./getEntry.js";
import playListShuffle from "./playListShuffle.js";
import accountVar from "./accountVar/index.js";
import getVodSetting from "./getVodSetting.js";
import nextEpisode from "./nextEpisode/index.js";
import episodes from "./episodes/index.js";

const app = {
    entryPoint: entryPoint,
    getEntry: getEntry,
    playListShuffle: playListShuffle,
    accountVar: accountVar,
    getVodSetting: getVodSetting,
    nextEpisode: nextEpisode,
    episodes: episodes
};

export default app;
