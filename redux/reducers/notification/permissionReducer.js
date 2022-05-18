
const app = (state = null, action) => {
    switch(action.type){
        case "notification/permission":
            return action.value;
        default:
            return state;
    };
};

export default app;
