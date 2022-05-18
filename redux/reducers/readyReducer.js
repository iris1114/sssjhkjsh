
const app = (state = false, action) => {
    switch(action.type){
        case "ready":
            return action.value;
        default:
            return state;
    };
};

export default app;
