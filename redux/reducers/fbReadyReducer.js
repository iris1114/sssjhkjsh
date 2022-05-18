
const app = (state = false, action) => {
    switch(action.type){
        case "fbReady":
            return action.value;
        default:
            return state;
    };
};

export default app;
