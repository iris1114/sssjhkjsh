
let def = {
    component: null,
    information: null,
    exitIcon: true
};

const app = (state = def, action) => {
    switch(action.type){
        case "dialog":
            let value = action.value;

            if(!value){
                return def;
            }
            
            let obj = {
                component: value.component,
                information: value.information || null,
                exitIcon: true
            };

            if(typeof value.exitIcon == "boolean"){
                obj.exitIcon = value.exitIcon;
            }

            return obj;
        default:
            return state;
    };
};

export default app;
