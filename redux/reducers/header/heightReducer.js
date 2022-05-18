
const app = (state = 90, action) => {
    switch(action.type){
        case "header/height":
            return action.value;
        default:
            return state;
    };
};

export default app;
