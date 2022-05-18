
const app = (state = null, action) => {
    switch(action.type){
        case "vod/watch/programInfo":
            return action.value;
        default:
            return state;
    };
};

export default app;
