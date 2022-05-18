
const app = (state = null, action) => {
    switch(action.type){
        case "login":
            return action.value;
        default:
            return state;
    };
};

export default app;
