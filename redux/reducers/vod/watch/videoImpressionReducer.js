
const app = (state = 0, action) => {
    switch(action.type){
        case "vod/watch/videoImpression":
            return action.value;
        default:
            return state;
    };
};

export default app;