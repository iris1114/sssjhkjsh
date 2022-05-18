
const app = (state = false, action) => {
    switch(action.type){
        case "ratingPass":
            return action.value;
        default:
            return state;
    };
};

export default app;
