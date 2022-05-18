
import Router from "next/router";

import gtagEvent from "../../assets/js/gtag/index.js";
import tools from "../../assets/js/tools/index.js";

const app = () => {
    try{
        window.dataLayer = window.dataLayer || [];
    
        //不可以使用箭頭函示
        window.gtag = function(){
            dataLayer.push(arguments);
        };

        gtag("js", new Date());
        gtagEvent.crossSite();
        gtagEvent.pageview();
        gtagEvent.pageviewMkt();

        Router.events.on("routeChangeComplete", (url) => {
            gtagEvent.pageview();
        });

        let url = `https://www.googletagmanager.com/gtag/js?id=${litv.config.gtagId}`;

        tools.importScript(url).then(() => {});
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
