
let def = {
    main: "",
    sub: ""
};

const app = (state = def, action) => {
    switch(action.type){
        case "header/focus":
            return action.value;
        default:
            return state;
    };
};

export default app;
