
const app = (state = false, action) => {
    switch(action.type){
        case "fullscreen":
            return action.value;
        default:
            return state;
    };
};

export default app;
