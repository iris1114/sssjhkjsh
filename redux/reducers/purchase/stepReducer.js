
const app = (state = 0, action) => {
    switch(action.type){
        case "purchase/step":
            return action.value;
        default:
            return state;
    };
};

export default app;
