
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

        let unSubscribeLogin = store.subscribe(() => {
            if(store.getState().login){
                unSubscribeLogin();

                api.accinfo.getNotices.getFetch().then((data) => {
                    if(data && data.result && data.result[0]){
                        let result = data.result[0];

                        if(checkTime(result) && checkExpird()){
                            promptDialog(result);
                        }
                    }
                });
            }
        });

        let checkTime = (result) => {
            let startTime = new Date(result.start_date).getTime();
            let endTime = new Date(result.end_date).getTime();
            let now = new Date().getTime();

            if(now >= startTime && now <= endTime){
                return true;
            }

            return false;
        };

        let checkExpird = () => {
            let now = new Date().getTime();
            let time = tools.storage.local.getItem("valid_dialog_time");
            let count = tools.storage.local.getItem("valid_dialog_count");

            if(!time || !count){
                return true;
            }
            else{
                time = parseInt(time);
                count = parseInt(count);

                let _now = new Date(now);
                let _time = new Date(time);

                if(checkSameDay(_now, _time)){
                    if(count < 1){
                        return true;
                    }
                }
                else{
                    tools.storage.local.setItem("valid_dialog_count", 0);

                    return true;
                }

                return false;
            }
        };

        let checkSameDay = (now, time) => {
            if(now.getFullYear() == time.getFullYear()){
                if(now.getMonth() == time.getMonth()){
                    if(now.getDate() == time.getDate()){
                        return true;
                    }
                }
            }

            return false;
        };

        let saveTime = () => {
            let now = new Date().getTime();
            let count = tools.storage.local.getItem("valid_dialog_count");

            if(!count){
                count = 0;
            }

            count = parseInt(count);
            count = count + 1;

            tools.storage.local.setItem("valid_dialog_time", now);
            tools.storage.local.setItem("valid_dialog_count", count);
        };

        let promptDialog = (result) => {
            store.dispatch({
                type: "dialog",
                value: {
                    component: "valid",
                    information: result,
                    exitIcon: false
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
                    if(!nComponent && oComponent == "valid"){
                        unSubscribeDialogClose();
                        Router.events.off("routeChangeComplete", routeChangeComplete.handler);
                        saveTime();
                    }
                    else if(nComponent && oComponent == "valid"){
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
