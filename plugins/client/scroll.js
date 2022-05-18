
import store from "../../redux/store.js";

const app = () => {
    try{
        let dispatch = () => {
            let x = 0;
            let y = 0;
    
            if(store.getState().scroll){
                x = store.getState().scroll.position.x;
                y = store.getState().scroll.position.y;
            }
    
            store.dispatch({
                type: "scroll",
                value: {
                    position: {
                        x: scrollX,
                        y: scrollY,
                    },
                    distance: {
                        x: (scrollX - x),
                        y: (scrollY - y)
                    }
                }
            });
        };
    
        addEventListener("scroll", () => {
            dispatch();
        });
    
        dispatch();
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
