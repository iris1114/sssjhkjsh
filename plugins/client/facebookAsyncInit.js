
import Router from "next/router";

import store from "../../redux/store.js";

const app = () => {
    try{
        let init = () => {
            FB.init({
                appId            : litv.config.facebookAppId,
                autoLogAppEvents : true,
                xfbml            : true,
                version          : "v8.0"
            });

            FB.getLoginStatus((response) => {
                store.dispatch({
                    type: "fbReady",
                    value: true
                });
            });
        };
    
        if(typeof FB != "undefined"){
            init();
        }
        else{
            window.fbAsyncInit = function() {
                init();
            };
        }
    
        Router.events.on("routeChangeComplete", (url) => {
            if(typeof FB != "undefined"){
                FB.XFBML.parse();
            }
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
