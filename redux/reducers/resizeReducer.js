
let def = {
    width: 1024,
    height: 768
};

const app = (state = def, action) => {
    switch(action.type){
        case "resize":
            return action.value;
        default:
            return state;
    };
};

export default app;
