
const app = (state = true, action) => {
    switch(action.type){
        case "header/show":
            return action.value;
        default:
            return state;
    };
};

export default app;
