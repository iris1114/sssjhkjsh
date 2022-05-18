
const app = (state = true, action) => {
    switch(action.type){
        case "footer/show":
            return action.value;
        default:
            return state;
    };
};

export default app;
