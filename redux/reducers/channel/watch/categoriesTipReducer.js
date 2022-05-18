
const app = (state = null, action) => {
    switch(action.type){
        case "channel/watch/categoriesTip":
            return action.value;
        default:
            return state;
    };
};

export default app;