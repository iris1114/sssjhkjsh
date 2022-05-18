
import Router from "next/router";

import store from "../../redux/store.js";

const app = () => {
    try{
        Router.events.on("routeChangeStart", () => {
            store.dispatch({
                type: "loading", 
                value: true
            });
        });

        Router.events.on("routeChangeComplete", () => {
            store.dispatch({
                type: "loading", 
                value: false
            });
        });

        Router.events.on("routeChangeError", () => {
            store.dispatch({
                type: "loading", 
                value: false
            });
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
