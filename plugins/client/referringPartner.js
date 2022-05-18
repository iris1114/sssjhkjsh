
import Router from "next/router";

import tools from "../../assets/js/tools/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        let referringPartner = tools.url.getQuery(location.href, "referringPartner");

        if(referringPartner){
            tools.storage.session.setItem("referringPartner", referringPartner);

            let router = store.getState().router;

            let unSubscribeStore = store.subscribe(() => {
                if(store.getState().router != router){
                    router = store.getState().router;
                    referringPartner = tools.url.getQuery(location.href, "referringPartner");

                    if(referringPartner){
                        let href = tools.url.removeQuery(location.href, "referringPartner");
                        
                        history.replaceState({
                            "url": Router.pathname,
                            "as": href,
                            "options": {},
                            "__N": true
                        }, document.title, href);
                    }
                    else{
                        unSubscribeStore();
                    }
                }
            });
        }
    }
    catch(ex){
        console.log(ex.stack);
    }
};


export default app;
