
const app = (state = 0, action) => {
    switch(action.type){
        case "beforeunload":
            return action.value;
        default:
            return state;
    };
};

export default app;
