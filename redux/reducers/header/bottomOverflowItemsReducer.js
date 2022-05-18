
const app = (state = [], action) => {
    switch(action.type){
        case "header/bottomOverflowItems":
            return action.value;
        default:
            return state;
    };
};

export default app;
