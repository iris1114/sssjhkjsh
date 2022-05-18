
const app = (state = null, action) => {
    switch(action.type){
        case "diversion/rank":
            return action.value;
        default:
            return state;
    };
};

export default app;
