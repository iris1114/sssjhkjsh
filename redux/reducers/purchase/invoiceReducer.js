
const app = (state = null, action) => {
    switch(action.type){
        case "purchase/invoice":
            return action.value;
        default:
            return state;
    };
};

export default app;
