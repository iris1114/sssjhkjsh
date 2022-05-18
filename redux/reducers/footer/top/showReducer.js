
const app = (state = true, action) => {
    switch(action.type){
        case "footer/top/show":
            return action.value;
        default:
            return state;
    };
};

export default app;
