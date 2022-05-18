
import Router from "next/router";

import store from "../../redux/store.js";
import gtagEvent from "../../assets/js/gtag/index.js";
import tools from "../../assets/js/tools/index.js";

const app = () => {
    //https://developers.google.com/web/fundamentals/app-install-banners
    try{
        let installPromptEvent = null;

        //todo
        let excludes = [
            "purchase",
            "purchase-groupId",
            "purchase-complete",
            "purchase-modify"
        ];

        let subscribeUserChoice = () => {
            installPromptEvent.userChoice.then((choiceResult) => {
                let now = new Date().getTime();

                tools.storage.local.setItem("pwa_prompt", now);

                if (choiceResult.outcome == "accepted") {
                    gtagEvent.pwa.accepted();
                } 
                else {
                    gtagEvent.pwa.dismissed();
                }
            });
        };

        let addToHomeScreen = () => {
            let pwaPrompt = tools.storage.local.getItem("pwa_prompt");
    
            if(!pwaPrompt){
                pwaPrompt = 0;
            }
            else{
                pwaPrompt = parseInt(pwaPrompt);
    
                if(isNaN(pwaPrompt)){
                    pwaPrompt = 0;
                }
            }
    
            let now = new Date().getTime();
    
            if((now - pwaPrompt) >= 24 * 60 * 60 * 1000){
                installPromptEvent.prompt();
                subscribeUserChoice();
                gtagEvent.pwa.installPrompt();
            }
        };

        let beforeinstallprompt = (event) => {
            event.preventDefault();
    
            installPromptEvent = event;
            
            if(installPromptEvent.prompt){
                logAppUninstalled();
                
                let routeChangeComplete = () => {
                    let router = store.getState().router;

                    if(excludes.indexOf(router.pathname) == -1){
                        addToHomeScreen();
                        Router.events.off("routeChangeComplete", routeChangeComplete);
                    }
                };

                Router.events.on("routeChangeComplete", routeChangeComplete);
            }

            removeEventListener("beforeinstallprompt", beforeinstallprompt);
        };

        let logAppUninstalled = () => {
            let pwaInstalled = tools.storage.local.getItem("pwa_installed");

            if(pwaInstalled == "true"){
                gtagEvent.pwa.appUninstalled();
            }

            tools.storage.local.setItem("pwa_installed", "false");
        };

        let logAppInstalled = () => {
            gtagEvent.pwa.appInstalled();
            removeEventListener("appinstalled", logAppInstalled);
            tools.storage.local.setItem("pwa_installed", "true");
        };

        addEventListener("beforeinstallprompt", beforeinstallprompt);
        addEventListener("appinstalled", logAppInstalled);
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
