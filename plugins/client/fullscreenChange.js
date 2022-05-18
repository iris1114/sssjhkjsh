
import store from "../../redux/store.js";

const app = () => {
    try{
        let dispatch = () => {
            let isFullscreen = store.getState().fullscreen;
            
            store.dispatch({
                type: "fullscreen",
                value: !isFullscreen
            });
        };
    
        /* Standard syntax */
        document.addEventListener("fullscreenchange", () => {
            dispatch();
        });
      
        /* Firefox */
        document.addEventListener("mozfullscreenchange", () => {
            dispatch();
        });
      
        /* Chrome, Safari and Opera */
        document.addEventListener("webkitfullscreenchange", () => {
            dispatch();
        });
      
        /* IE / Edge */
        document.addEventListener("msfullscreenchange", () => {
            dispatch();
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
