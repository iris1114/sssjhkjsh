
const app = (state = null, action) => {
    switch(action.type){
        case "router":
            return action.value;
        default:
            return state;
    };
};

export default app;
