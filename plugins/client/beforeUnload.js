
import store from "../../redux/store.js";

const app = () => {
    try{
        addEventListener("beforeunload", () => {
            store.dispatch({
                type: "beforeunload", 
                value: new Date().getTime()
            });
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
