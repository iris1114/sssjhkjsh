
const app = (state = null, action) => {
    switch(action.type){
        case "channel/watch/player/tabs/channelsTip":
            return action.value;
        default:
            return state;
    };
};

export default app;