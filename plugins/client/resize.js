
import store from "../../redux/store.js";

const app = () => {
    try{
        let dispatch = () => {
            store.dispatch({
                type: "resize", 
                value: {
                    width: innerWidth,
                    height: innerHeight
                }
            });
        };
    
        addEventListener("resize", () => {
            dispatch();
        });

        dispatch();
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
