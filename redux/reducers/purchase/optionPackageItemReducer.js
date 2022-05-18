
let obj = {};

const app = (state = obj, action) => {
    switch(action.type){
        case "purchase/optionPackageItem":
            let value = action.value;

            if(!value){
                return obj;
            }

            return value;
        default:
            return state;
    };
};

export default app;
