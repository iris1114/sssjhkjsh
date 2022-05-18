
const app = (state = false, action) => {
    switch(action.type){
        case "purchase/recurrent":
            return action.value;
        default:
            return state;
    };
};

export default app;
