
const app = (state = null, action) => {
    switch(action.type){
        case "toast":
            if(action.value){
                return {
                    message: action.value
                };
            }
            else{
                return null;
            }
        default:
            return state;
    };
};

export default app;