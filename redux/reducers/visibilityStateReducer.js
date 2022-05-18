
const app = (state = true, action) => {
    switch(action.type){
        case "visibilityState":
            return action.value;
        default:
            return state;
    };
};

export default app;
