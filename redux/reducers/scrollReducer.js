
const app = (state = null, action) => {
    switch(action.type){
        case "scroll":
            return action.value;
        default:
            return state;
    };
};

export default app;
