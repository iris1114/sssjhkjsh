
const app = (state = null, action) => {
    switch(action.type){
        case "vod/watch/shareBalloonTrigger":
            return action.value;
        default:
            return state;
    };
};

export default app;