
const app = (state = false, action) => {
    switch(action.type){
        case "tvodPass":
            return action.value;
        default:
            return state;
    };
};

export default app;
