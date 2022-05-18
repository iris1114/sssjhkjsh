
let def = {
    value: false
};

const app = (state = def, action) => {
    switch(action.type){
        case "loading":
            if(action.value){
                return {
                    value: true
                }
            }
            else{
                return {
                    value: false
                }
            }
        default:
            return state;
    };
};

export default app;