
import Router from "next/router";

import api from "../../assets/js/api/index.js";
import tools from "../../assets/js/tools/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        let unSubscribeDialogClose = null;

        let routeChangeComplete = {
            result: null,
            handler (){
                promptDialog(routeChangeComplete.result);
            }
        };

        let unSubscribeReady = store.subscribe(() => {
            if(store.getState().ready){
                unSubscribeReady();

                api.env.bulletin.getFetch().then((result) => {
                    if(result && result.id){
                        if(isDisplay(result)){
                            promptDialog(result);
                        }
                    }
                });
            }
        });

        let isDisplay = (result) => {
            let bulletinStorage = tools.storage.local.getItem("bulletin");

            if(bulletinStorage){
				bulletinStorage = JSON.parse(bulletinStorage);
            }
            
            if(!bulletinStorage || (bulletinStorage.id != result.id)){
                return true;
            }
            else{
                if(result.level == "error"){
                    let now = new Date().getTime();
                    let bulletinNoticeTime = tools.storage.local.getItem("bulletin_notice_time");

                    bulletinNoticeTime = parseInt(bulletinNoticeTime);
                    
                    if(now - bulletinNoticeTime >= (60 * 1000)){
                        return true;
					}
                }
            }

            return false;
        };

        let saveTime = (result) => {
            let now = new Date().getTime();

            tools.storage.local.setItem("bulletin", JSON.stringify(result));
            tools.storage.local.setItem("bulletin_notice_time", now);
        };

        let promptDialog = (result) => {
            store.dispatch({
                type: "dialog",
                value: {
                    component: "bulletin",
                    information: result
                }
            });

            dialogCloseHandler(result);
        };

        let dialogCloseHandler = (result) => {
            if(unSubscribeDialogClose){
                unSubscribeDialogClose();
            }

            let oComponent = store.getState().dialog.component;

            unSubscribeDialogClose = store.subscribe(() => {
                let nComponent = store.getState().dialog.component

                if(oComponent != nComponent){
                    if(!nComponent && oComponent == "bulletin"){
                        unSubscribeDialogClose();
                        Router.events.off("routeChangeComplete", routeChangeComplete.handler);
                        saveTime(result);
                    }
                    else if(nComponent && oComponent == "bulletin"){
                        unSubscribeDialogClose();

                        routeChangeComplete.result = result;
                        
                        Router.events.off("routeChangeComplete", routeChangeComplete.handler);
                        Router.events.on("routeChangeComplete", routeChangeComplete.handler);
                    }

                    oComponent = nComponent;
                }
            });
        };
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
