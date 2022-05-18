
const app = (state = false, action) => {
    switch(action.type){
        case "purchasePass":
            return action.value;
        default:
            return state;
    };
};

export default app;
