
import tools from "../../assets/js/tools/index.js";
import gtagEvent from "../../assets/js/gtag/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        let unSubscribeReady = store.subscribe(() => {
            if(store.getState().ready){
                unSubscribeReady();
                init();
            }
        });

        let init = () => {
            if(!litv.config.oneSignalAppId){
                return;
            }
    
            if(typeof Notification == "undefined"){
                return;
            }

            tools.importScript("https://cdn.onesignal.com/sdks/OneSignalSDK.js").then(() => {
                window.OneSignal = window.OneSignal || [];

                OneSignal.push(() => {
                    OneSignal.init({
                        //appId: "4d193cb9-2b7b-4487-be2d-11550c26cb34", //http://localhost:3000
                        appId: litv.config.oneSignalAppId
                    });
                });

                OneSignal.push(() => {
                    return new Promise((resolve, reject) => {
                        let permission = Notification.permission;

                        dispatchPermission(permission);
                        setSubscription(permission);
                        watchPermission();
                        resolve();
                    });
                });
            });
        };

        let watchPermission = () => {
            if ("permissions" in navigator) {
                navigator.permissions.query({ 
                    name: "notifications" 
                }).then((notificationPerm) => {
                    notificationPerm.addEventListener("change", () => {
                        let state = notificationPerm.state;

                        if(state == "prompt"){
                            state = "default";
                        }
                        
                        gtagEvent.oneSignal.permission(state);
                        
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    });
                });
            }
            //原生的listener在點擊permission dialog的X都不會callback，逼不得已才起interval監控
            /*
            let checkInterval = setInterval(() => {
                let permission = Notification.permission;
                let storePermission = context.store.state.notification.permission;

                if(permission != storePermission){
                    clearInterval(checkInterval);
                    gtagEvent.permission(permission);
                    location.reload();
                }
            }, 1000);
            */
        };

        let dispatchPermission = (permission) => {
            store.dispatch({
                type: "notification/permission",
                value: permission
            });
        };

        let setSubscription = (permission) => {
            if(permission == "denied"){
                OneSignal.setSubscription(false);
            }
            else{
                OneSignal.setSubscription(true);
            }
        };
    }
    catch(ex){
        console.log(ex.stack);
    }
}

export default app;
