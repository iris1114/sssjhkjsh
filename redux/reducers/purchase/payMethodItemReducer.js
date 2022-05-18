
const app = (state = null, action) => {
    switch(action.type){
        case "purchase/payMethodItem":
            return action.value;
        default:
            return state;
    };
};

export default app;
