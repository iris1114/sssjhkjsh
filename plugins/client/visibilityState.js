
import store from "../../redux/store.js";

const app = () => {
    try{
        document.addEventListener("visibilitychange", () => {
            let visibility = document.visibilityState;
    
            store.dispatch({
                type: "visibilityState", 
                value: visibility
            });
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
