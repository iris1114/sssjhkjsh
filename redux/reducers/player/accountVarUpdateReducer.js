
const app = (state = 0, action) => {
    switch(action.type){
        case "player/accountVarUpdate":
            return action.value;
        default:
            return state;
    };
};

export default app;