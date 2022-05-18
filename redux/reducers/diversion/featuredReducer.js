
const app = (state = null, action) => {
    switch(action.type){
        case "diversion/featured":
            return action.value;
        default:
            return state;
    };
};

export default app;
