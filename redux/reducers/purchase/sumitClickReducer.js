
const app = (state = null, action) => {
    switch(action.type){
        case "purchase/sumitClick":
            return action.value;
        default:
            return state;
    };
};

export default app;
