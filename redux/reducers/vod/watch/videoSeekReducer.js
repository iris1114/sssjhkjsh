
const app = (state = null, action) => {
    switch(action.type){
        case "vod/watch/videoSeek":
            return action.value;
        default:
            return state;
    };
};

export default app;