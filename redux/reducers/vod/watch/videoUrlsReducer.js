
const app = (state = null, action) => {
    switch(action.type){
        case "vod/watch/videoUrls":
            return action.value;
        default:
            return state;
    };
};

export default app;