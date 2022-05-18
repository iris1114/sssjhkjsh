
const app = (state = null, action) => {
    switch(action.type){
        case "companionAd/ad":
            return action.value;
        default:
            return state;
    };
};

export default app;
