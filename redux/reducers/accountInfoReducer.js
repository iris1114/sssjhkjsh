
const app = (state = null, action) => {
    switch(action.type){
        case "accountInfo":
            return action.value;
        default:
            return state;
    };
};

export default app;
