
const app = (state = null, action) => {
    switch(action.type){
        case "menu":
            return action.value;
        default:
            return state;
    };
};

export default app;